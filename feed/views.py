import re
from django.contrib.auth.models import User
from django.db.models.base import Model
from django.http import HttpResponseRedirect, request 
from django.http.response import HttpResponseBadRequest, JsonResponse,HttpResponse
from django.views.generic import TemplateView
from django.views.generic import  DetailView, View,DeleteView,ListView,FormView
from django.views.generic.edit import CreateView, UpdateView

from profiles.models import Profile
from .models import Comment, Notification, Post,Like
from django.shortcuts import get_object_or_404, redirect, render
from feed import models
from django.contrib.auth.mixins import LoginRequiredMixin
from followers.models import Follower
from django.urls import reverse
from django.http import JsonResponse
from django.template import loader
from .forms import CommentForm, PostForm,CommentForms
# Create your views here.


class HomePage(TemplateView):
    http_method_names = ["get"]
    template_name = "feed/homepage.html"
    # model = Post
    # context_object_name = "posts"
    # queryset = Post.objects.all().order_by('-id')[0:30]

   
    def dispatch(self, request, *args, **kwargs):

            if request.user.is_authenticated:
                self.request = request
            
                return super().dispatch(request, *args, **kwargs)

            return render(request,'feed/homepage.html')
            # return render(request,'includes/login.html')


    def get_context_data(self, *args, **kwargs):
        context = super().get_context_data(*args, **kwargs)


        comment_form = CommentForm()
        posts= Post.objects.all().order_by('-id')[0:30]
        profile= Profile.objects.get(user=self.request.user)
        
        context['posts'] = posts
        context['comment_form'] = comment_form
        context['profile'] = profile
        
        
        return context

# def HomePageView(request):
#     if request.user.is_authenticated:
#         comment_form = CommentForm()
#         posts= Post.objects.all().order_by('-id')[0:30]
#         profile= Profile.objects.get(user=request.user)

#         context = {
#             'posts' : posts,
#             'comment_form' : comment_form,
#             'profile' : profile,
#         }

#         return render(request,'feed/homepage.html',context)
    
#     print("here it is login area")
#     return render(request,'feed/homepage.html')


class PostDetailView(DetailView):
    http_method_names = ["get"]
    template_name = "feed/detail.html"
    model = Post
    context_object_name = "post"
   

    def get_context_data(self, **kwargs):

        context = super().get_context_data(**kwargs)
        no_of_likes = get_object_or_404(Post, id = self.kwargs['pk'])
        
        # total_likes = no_of_likes.total_like()

        liked = False
        if no_of_likes.likes.filter(id = self.request.user.id).exists():
            liked = True 
        

        # context['total_likes'] = total_likes
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

class FindFriends(ListView):
    model = Post
    http_methods_name = ['get']
    template_name = "feed/findfriends.html"

    def get_context_data(self, **kwargs):
        context =  super().get_context_data(**kwargs)

        if 'keyword' in self.request.GET:
            keyword = self.request.GET['keyword']
        
          
            if keyword:  
                context['user_details'] = Profile.objects.order_by('-user').filter(user__username__icontains = keyword)
                context['keyword'] = keyword
                return context
        else:
            context['user_details'] = Profile.objects.all()
            return context


def Like_post(request):
    user = request.user
    if request.method == 'POST':
        post_id = request.POST.get('post_id')
        post_object = Post.objects.get(id=post_id)
        user = User.objects.get(id = request.user.id)
        post_author = User.objects.get(username=post_object.author.username)
       
        profile = Profile.objects.get_or_create(user=user)
        # profiles = Profile.objects.filter(user__username = post_object.author.username)
        print("username:",user.username)
        print("post_photo:",post_object.author.profile.image.url)
       
        # print("Post Author : ",post_object.author.username)

        if user in post_object.likes.all():
            post_object.likes.remove(user)
        else:
            post_object.likes.add(user)
           
            notification = Notification.objects.create(
                notification_type = 1,
                to_user = post_author,
                from_user = user,
                post = post_object,
           
            )
            notification.save()

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

        user = Profile.objects.get(user=request.user) 
        
        posts= Post.objects.all().order_by('-id')[0:30]

        if request.method == 'POST':
            post_id = request.POST.get('post_id')
            content = request.POST.get('content')
            post_object = Post.objects.get(id=post_id)
            print("post_object",post_object)
            print("post_id",post_id)
           
          
            comment_form = Comment.objects.create(
                user = user,
                post = post_object,
                content = content,
            )
            comment_form.save()
            comment_count = Comment.objects.filter(post_id = post_id).count()
            print("comment count:",comment_count)
            cform = CommentForm()
            context = {
                'posts' : posts,
                'comment_form' : cform,
                'profile':user,
            }
            
            return JsonResponse({"comment":content,"message":"success","user" : user.user.username,"comment_count":comment_count})
            # return render(request,'includes/post.html',context)
 


def delete_post(request):
    user = request.user
    if request.method == 'POST':
        post_id = request.POST.get('post_id')
        print("post_id",post_id)
        post_object = Post.objects.get(id=post_id)
        print("post_object",post_object)
        post_object.delete()
        # print("post_id:",post_id)
        # post_object.delete()
        return JsonResponse({"message":"success"})
    return JsonResponse({"message":"not "})
    
def updatePost(request):
    user = request.user
    if request.method == 'POST':
      
        photo = request.FILES.get('photo')
        photo_des = request.POST.get('post_des')
        post_id = request.POST.get('post_id')
        post_object = Post.objects.get(id=post_id)
        if not photo:
            print("its none")
            post_object.photo = post_object.photo
        else :
            post_object.photo = photo
               
            # print(p)
        print("post_id:",post_id)
        print("photo url:",photo)
        print("photo desc",photo_des)
       
        post_object.text = photo_des
    

        post_object.save()
        return JsonResponse({"message":"Success","photourl":str(photo)})
    return JsonResponse({"message":"Wrong response"})

class UpdatePost(LoginRequiredMixin,View):

    def get(self, request, pk, *args, **kwargs):

        if request.method == 'POST':
            post_id = request.POST.get("post_id")
            post = Post.objects.get(id=post_id)
            print("post_id:",post_id)
            
            return JsonResponse({"message":"success"})
        return JsonResponse({"message":"Wrong response"})

#Notification user has seen will be enabled after clicking on posts and user profile  
def post_notification(request,notification_pk,post_pk):
    notification = Notification.objects.get(pk = notification_pk)
    post = Post.objects.get(id = post_pk)
    notification.user_has_seen = True
    notification.save()

    return redirect('feed:detail', pk=post.pk)

def user_profile_notification(request,notification_pk,user_pk):
    notification = Notification.objects.get(pk = notification_pk)
    user = User.objects.get(pk = user_pk)
    notification.user_has_seen = True
    notification.save()

    return redirect('profiles:detail', username=user.username)