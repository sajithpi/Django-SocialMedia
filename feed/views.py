from ast import Store
from email import message
import re
from turtle import pos, st
from django import views
from django.contrib.auth.models import User
from django.http import HttpResponseRedirect, request 
from django.http.response import HttpResponseBadRequest, JsonResponse,HttpResponse
from django.template import context
from django.views.generic import TemplateView
from django.views.generic import  DetailView, View,ListView,FormView
from django.views.generic.edit import CreateView, UpdateView
from django.contrib import messages
from profiles.models import MessageModel, Profile, ThreadModel
from feed.models import Favorites
from .models import Comment, Notification, Post,Like, Stories
from django.db.models import Q
from chat.models import Chat, RoomChat
from django.shortcuts import get_object_or_404, redirect, render
from django.contrib.auth.mixins import LoginRequiredMixin
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
        user = User.objects.get(id=self.request.user.id)
        try:
            stories = Stories.objects.order_by('author')
            for story in stories:
                hour = story.created_time.hour
                story = Stories.objects.get(id=story.id)
                if hour > 24 :
                     story.delete()
                     print("Story Time Exeeded 1 Day")
        except Stories.DoesNotExist:
            pass

        # Fetching chat History
        try:
            rooms = RoomChat.objects.filter(Q(sender =self.request.user.username) | Q(receiver = self.request.user.username))
            chats = []
            for room in rooms:
                chat = Chat.objects.filter(room = room).last()
                chats.append(chat)
                
            for i in chats:
                print(i.content)
        except:
            pass
    
        
        context['posts'] = posts
        context['comment_form'] = comment_form
        context['profile'] = profile
        context['rooms'] = rooms
        context['chats'] = chats
        context['stories'] = stories
        
        return context

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


def addStory(request):
    if request.method == 'POST':
        image = request.FILES.get('photo')
        description = request.POST.get('text')
        user = User.objects.get(id = request.user.id)
        print("text:",description)
        print("image:",image)
        print("username:",user.username)
        stories = Stories.objects.create(
            text = description,
            photo = image,
            author = user
        )
        stories.save()
        return JsonResponse({"message":"success"})
    return JsonResponse({'message':'not'})

def View_story(request):
    if request.method == 'POST':
        story_id = request.POST.get('story_id')
        story_author = request.POST.get('story_author')
        print("story_id:",story_id)
        print("story_author:",story_author)
        story = Stories.objects.filter(author__username=story_author).order_by("-created_time").values()
        story_seen = Stories.objects.filter(author__username=story_author).order_by("created_time")
        # print("story count:",story))
        story_count = story.count()
        user = User.objects.get(id= request.user.id)
        # story.viewers.add(user)
        return JsonResponse({'message':'success','story':list(story),'count':story_count,'username':user.username})
    return JsonResponse({"message":"not"})

def Story_Seen(request):
    if request.method == 'POST':
        return JsonResponse({"message":"success"})
    return JsonResponse({"message":"not"})
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

    return JsonResponse({"message":"error"}, safe=False)

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

            # Notification for commented post

            from_user = User.objects.get(id = request.user.id)
            post_author = User.objects.get(username=post_object.author.username)
            notification = Notification.objects.create(
                notification_type = 2,
                to_user = post_author,
                from_user = from_user,
                post = post_object,
            )
            notification.save()
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
        messages.success(request,"Your Post Deleted SuccessFully")
        return JsonResponse({"message":"success"})
    return JsonResponse({"message":"not "})

def AddFavorites(request):
    if request.method == 'POST':
        post_id = request.POST['post_id']
        user = User.objects.get(id=request.user.id)
        posts = Post.objects.get(id=post_id)
        try:
            favorite = Favorites.objects.get(user__id = user.id, post__id = posts.id)
            favorite.delete()
            return JsonResponse({"message":"success","choice":"delete"})
        except:
            favoriteForm = Favorites.objects.create(
                
                user = user,
                post = posts,
            )
            favoriteForm.save()
        return JsonResponse({"message":"success","choice":"add"})
    return JsonResponse({"message":"not"})
  

def Search_Room(request):
    if request.method == 'POST':
        keyword = request.POST['search_keyword']
        print("keyword:",keyword)
        users = Profile.objects.order_by("-user").filter(user__username__icontains=keyword).values()
        username = User.objects.order_by("-username").filter(username__icontains=keyword).values()
        context = {
            "room_users":users
        }
        # return render(request,'feed/homepage.html',context)
        return JsonResponse({"message":"success","room_users":list(users),"username":list(username)})
    return JsonResponse({"message":"not"})

def delete_comment(request):
    user = request.user
    if request.method == 'POST':
        comment_id = request.POST.get('comment_id')
        commented_user = request.POST.get('commented_user')
        commented_user_id = request.POST.get('commented_user_id')
    
        if(request.user.username == commented_user):
                print("post_id:",comment_id)
                print("commented_user:",commented_user)
                print("commented_user_id:",commented_user_id)
                comment = Comment.objects.get(id = comment_id,user__user_id = commented_user_id)
                comment.delete()
                messages.success(request,"Your Comment Deleted SuccessFully")
                return JsonResponse({"message":"success"})
        else:
            print("This is not your comment")

        
    return JsonResponse({"message":"not "})

def update_comment(request):
    if request.method == 'POST':
        commented_user_id = request.POST.get("commented_user_id")
        comment_id = request.POST.get("comment_id")
        comment_content = request.POST.get("comment_content")
        commented_user = request.POST.get('commented_user')
        post_id = request.POST.get('post_id')
        if(request.user.username == commented_user):
            print("post_id:",comment_id)
            print("commented_user:",commented_user)
            print("commented_user_id:",commented_user_id)
            print("comment_content:",comment_content)

            comment = Comment.objects.get(id = comment_id,user_id = commented_user_id)
            comment.content = comment_content
            comment.save()
            messages.success(request,"Your Comment Updated SuccessFully")
            return JsonResponse({"message" : "success"})
    return JsonResponse({"message" : "not"})


    
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
        print("photo object url:",post_object.photo)
        messages.success(request,"Your Post Updated SuccessFully")
        return JsonResponse({"message":"Success","photourl":str(post_object.photo)})
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


