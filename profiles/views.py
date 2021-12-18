from django.contrib.auth.models import User
from django.shortcuts import render
from django.contrib import messages
from django.views.generic import DetailView, View, UpdateView
from django.contrib.auth.mixins import LoginRequiredMixin
from django.http import JsonResponse, HttpResponseBadRequest
from django.views.generic.base import TemplateView
from django.contrib.auth.views import PasswordChangeView
from django.contrib.auth.forms import PasswordChangeForm
from django.urls import reverse_lazy
from feed.models import Post
from followers.models import Follower
from profiles.forms import UserForm
from profiles.models import  Profile

class PasswordsChangeView(PasswordChangeView):
    form_class = PasswordChangeForm
    # success_url = reverse_lazy('password_success')
    success_url = reverse_lazy('profiles:password_success')
    template_name="account/password_change.html"

def password_success(request):
    return render(request,'account/password_success.html',{})

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

class ProfilePersonalUpdate(UpdateView):
    template_name = "profiles/update.html"
    model = Profile
    # form_class = UserForm
    fields = "__all__"
    success_url = "/"
    slug_field = "id"
    slug_url_kwarg = "id"
    def dispatch(self, request, *args, **kwargs):
        self.request = request
        return super().dispatch(request,*args,**kwargs)

    def form_valid(self, form):
        messages.add_message(self.request ,messages.SUCCESS,'User Details Updated Successfully')
        return super().form_valid(form)


        


class ProfileLoginUpdate(UpdateView):
    template_name = "profiles/updateuser.html"
    model = User
    
    fields = "__all__"
    success_url = "/"
    slug_field = "id"
    slug_url_kwarg = "id"
    def dispatch(self, request, *args, **kwargs):
        self.request = request
        return super().dispatch(request,*args,**kwargs)

    def form_valid(self, form):
        messages.add_message(self.request ,messages.SUCCESS,'User Details Updated Successfully')
        return super().form_valid(form)

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

