
from django.contrib.auth.models import User
from django.db.models.base import Model
from django.http import HttpResponseRedirect 
from django.http.response import HttpResponseBadRequest, JsonResponse
from django.views.generic import TemplateView
from django.views.generic import  DetailView, View
from django.views.generic.edit import CreateView

from profiles.models import Profile
from .models import Post
from django.shortcuts import get_object_or_404, redirect, render
from feed import models
from django.contrib.auth.mixins import LoginRequiredMixin
from followers.models import Follower
from django.urls import reverse

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
        # like= 
        # total_likes = Post.objects.last()
       
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
        
  
        # for post in posts:
        #     id = posts.id
     
        context['posts'] = posts
        # context['total_likes'] = total_likes
        return context


class PostDetailView(DetailView):
    http_method_names = ["get"]
    template_name = "feed/detail.html"
    model = Post
    context_object_name = "post"
   

    def get_context_data(self, **kwargs):

        context = super().get_context_data(**kwargs)
        no_of_likes = get_object_or_404(Post, id = self.kwargs['pk'])
        total_likes = no_of_likes.total_like()

        liked = False
        if no_of_likes.likes.filter(id = self.request.user.id).exists():
            liked = True 
        

        context['total_likes'] = total_likes
        context['liked'] = liked
        return context

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


def likeView(request, pk):

    post = get_object_or_404(Post,id = request.POST.get('post_id'))
    liked = False
    if post.likes.filter(id=request.user.id).exists():
        post.likes.remove(request.user)
        liked = False
    else:
        post.likes.add(request.user)
        liked = True
    
    return redirect('feed:detail',pk = pk)




class likeViews(LoginRequiredMixin, View):
    http_method_names = ["post"]

    def post(self, request, *args, **kwargs):
        # post = request.POST.dict()
        post = get_object_or_404(Post,id = request.POST.get('pk'))
        liked = False  
        # if "action" not in post or "pk" not in post:
        #         return HttpResponseBadRequest("Missing data")

        
        # if data['action'] == "like":
            # Like
        # if post['action'] == "like":
        if post.likes.filter(id=request.user.id).exists():
                post.likes.remove(request.user)
                liked = False  

        else:
            # Dislike
            post.likes.add(request.user)
            liked = True

        return JsonResponse({
            'success': True,
            # 'wording': "Dislike" if post['action'] == "like" else "Like"
            
        })