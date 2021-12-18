from django.contrib.auth.models import User
from django.contrib import messages
from django.views.generic import DetailView, View, UpdateView
from django.contrib.auth.mixins import LoginRequiredMixin
from django.http import JsonResponse, HttpResponseBadRequest
from django.views.generic.base import TemplateView

from feed.models import Post
from followers.models import Follower
from profiles.models import Profile


class UserDetailView(TemplateView):
    http_method_names = ["get"]
    template_name = "profiles/profile.html"
    model = User
    context_object_name = "user"
    slug_field = "username"
    slug_url_kwarg = "username"

    
    def get_context_data(self, **kwargs):
        user = self.request.user
        context = super().get_context_data(**kwargs)
        context['total_posts'] = Post.objects.filter(author=user).count()
        context['total_followers'] = Follower.objects.filter(following=user).count()
       
        return context
    
    

class ProfileDetailView(DetailView):
    http_method_names = ["get"]
    template_name = "profiles/detail.html"
    model = User
    context_object_name = "user"
    slug_field = "username"
    slug_url_kwarg = "username"

    def dispatch(self, request, *args, **kwargs):
        self.request = request
        return super().dispatch(request, *args, **kwargs)

    def get_context_data(self, **kwargs):
        user = self.get_object()
        # U = User.objects.get(username=user)
        # U.set_password('appu123456789111')
        # U.save()
        context = super().get_context_data(**kwargs)
        context['total_posts'] = Post.objects.filter(author=user).count()
        context['total_followers'] = Follower.objects.filter(following=user).count()
        if self.request.user.is_authenticated:
            context['you_follow'] = Follower.objects.filter(following=user, followed_by=self.request.user).exists()
        return context

class ProfileUpdate(UpdateView):
    model = User
    template_name = 'profiles/Profile.html'
    fields = "__all__"
    context_object_name = "user"
    success_url = "/" # This is where the user will be 
                                       # redirected once the form
                                       # is successfully filled in

    def get_object(self, queryset=None):
        '''This method will load the object
           that will be used to load the form
           that will be edited'''
        return self.request.user
        


class FollowView(LoginRequiredMixin, View):
    http_method_names = ["post"]

    def post(self, request, *args, **kwargs):
        data = request.POST.dict()

        if "action" not in data or "username" not in data:
            return HttpResponseBadRequest("Missing data")

        try:
            other_user = User.objects.get(username=data['username'])
        except User.DoesNotExist:
            return HttpResponseBadRequest("Missing user")

        if data['action'] == "follow":
            # Follow
            follower, created = Follower.objects.get_or_create(
                followed_by=request.user,
                following=other_user
            )
        else:
            # Unfollow
            try:
                follower = Follower.objects.get(
                    followed_by=request.user,
                    following=other_user,
                )
            except Follower.DoesNotExist:
                follower = None

            if follower:
                follower.delete()

        return JsonResponse({
            'success': True,
            'wording': "Unfollow" if data['action'] == "follow" else "Follow"
        })
