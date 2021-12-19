
from django.contrib.auth.models import User
from django.db.models.base import Model
from django.views.generic import TemplateView
from django.views.generic import  DetailView
from django.views.generic.edit import CreateView

from profiles.models import Profile
from .models import Post
from django.shortcuts import render
from feed import models
from django.contrib.auth.mixins import LoginRequiredMixin
from followers.models import Follower

# Create your views here.


class HomePage(TemplateView):
    http_method_names = ["get"]
    template_name = "feed/homepage.html"
    # model = Post
    # context_object_name = "posts"
    # queryset = Post.objects.all().order_by('-id')[0:30]

    def dispatch(self, request, *args, **kwargs):
        self.request = request
        return super().dispatch(request, *args, **kwargs)

    def get_context_data(self, *args, **kwargs):
        context = super().get_context_data(*args, **kwargs)
        # context['posts'] = Post.objects.all()
        if self.request.user.is_authenticated:

            following = list(
                Follower.objects.filter(followed_by=self.request.user).values_list('following', flat=True)
            
            )
            if not following:
                  posts= Post.objects.all().order_by('-id')[0:30]
            else:
                posts= Post.objects.filter(author__in=following).order_by('-id')[0:30]
        else:
            posts= Post.objects.all().order_by('-id')[0:30]
        context['posts'] = posts
        return context


class PostDetailView(DetailView):
    http_method_names = ["get"]
    template_name = "feed/detail.html"
    model = Post
    context_object_name = "post"

class UploadPost(LoginRequiredMixin,CreateView):
    model = Post
    # http_method_names = ["get"]
    template_name = "feed/uploadPost.html"
    fields = ['text','photo']
    success_url ="/"

    def dispatch(self, request, *args, **kwargs):
        self.request = request
        return super().dispatch(request,*args,**kwargs)

    def form_valid(self, form):
      
        obj = form.save(commit=False)
        obj.author = self.request.user
        obj.save()
        return super().form_valid(form)

    def post(self, request, *args, **kwargs):
        post =  Post.objects.create(
            text = request.POST.get("text"),
            photo = request.FILES.get("photo"),
            author = request.user,
        )
        return render(
            request,
            "includes/post.html",
            {
                "post":post,
            },
            content_type="application/html"
        )

class FindFriends(TemplateView):
 
    template_name = "feed/findfriends.html"
    # context_object_name = "user"
    # queryset = Profile.objects.all().order_by('-id')[0:30]
    
    def get_context_data(self, **kwargs):
        context =  super().get_context_data(**kwargs)
        context['user_details'] = Profile.objects.all()
        return context



