
from django.contrib.auth.models import User
from django.db.models.base import Model
from django.http import HttpResponseRedirect, request 
from django.http.response import HttpResponseBadRequest, JsonResponse
from django.views.generic import TemplateView
from django.views.generic import  DetailView, View
from django.views.generic.edit import CreateView

from profiles.models import Profile
from .models import Post,Like
from django.shortcuts import get_object_or_404, redirect, render
from feed import models
from django.contrib.auth.mixins import LoginRequiredMixin
from followers.models import Follower
from django.urls import reverse
from django.http import JsonResponse
from .forms import CommentForm
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


def Like_post(request):
    user = request.user
    if request.method == 'POST':
        post_id = request.POST.get('post_id')
        post_object = Post.objects.get(id=post_id)

        if user in post_object.likes.all():
            post_object.likes.remove(user)
        else:
            post_object.likes.add(user)

        like, created = Like.objects.get_or_create(user=user,post_id=post_id)
        if not created:
            if like.value == 'Like':
                like.value = 'Dislike'
            else:
                like.value = "Like"
        like.save()

        data = {
            'value':like.value,
            'likes':post_object.likes.all().count()
        }
        return JsonResponse(data, safe=False)

    return redirect('feed:home')

def Comment_post(request):

    
  
    if request.user.is_authenticated:
            user = Profile.objects.get(user=request.user)
           
            following = list(
                Follower.objects.filter(followed_by=request.user).values_list('following', flat=True)
            
            )
            if not following:
                  posts= Post.objects.all().order_by('-id')[0:30]
            else:
                posts= Post.objects.filter(author__in=following).order_by('-id')[0:30]
  
            posts= Post.objects.all().order_by('-id')[0:30]
            profile= Profile.objects.get(user=request.user)
    
            comment_form = CommentForm(request.POST or None)
            context = {
                'posts' : posts,
                'comment_form' : comment_form,
                'profile':profile,
            }

            if comment_form.is_valid():
                instance  = comment_form.save(commit=False)
                instance.user = user
                instance.post = Post.objects.get(id=request.POST.get('post_id'))
                instance.save()
                comment_form = CommentForm()
            

            return render(request,'feed/homepage.html',context)
    else:
        return render(request,'feed/homepage.html')