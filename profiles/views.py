from django.contrib.auth.models import User
from django.forms import forms
from django.shortcuts import redirect, render
from django.contrib import messages
from django.db.models import Q
from django.views.generic import DetailView, View, UpdateView
from django.contrib.auth.mixins import LoginRequiredMixin
from django.http import JsonResponse, HttpResponseBadRequest, request
from django.views.generic.base import TemplateView
from django.contrib.auth.views import PasswordChangeView
from django.contrib.auth.forms import PasswordChangeForm
from django.urls import reverse_lazy
from feed.models import Favorites, Notification, Post
from followers.models import Follower
from profiles.forms import MessageForm, ThreadForm, UserForm
from profiles.models import  MessageModel, Profile, ThreadModel

class PasswordsChangeView(PasswordChangeView):
    form_class = PasswordChangeForm
    # success_url = reverse_lazy('password_success')
    success_url = reverse_lazy('profiles:password_success')
    template_name="account/password_change.html"

def password_success(request):
    messages.success(request,"Your Password has been Updated SuccessFully")
    return render(request,'account/password_success.html',{})


class ProfileDetailView(DetailView):
    http_method_names = ["get"]
    template_name = "profiles/my_profile_details.html"
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
        user = User.objects.get(username = self.kwargs['username'])

        print("user:",self.kwargs['username'])
        email = user.email
        favorites = Favorites.objects.filter(user__username = self.kwargs['username'])
        context = super().get_context_data(**kwargs)
        context['total_posts'] = Post.objects.filter(author=user).count()
        context['userss'] = User.objects.get(username = self.kwargs['username'])
        context['total_followers'] = Follower.objects.filter(following=user).count()
        context['total_following'] = Follower.objects.filter(followed_by = user).count()
        context['favorites'] = favorites
        context['profile_name'] = email.split('@')[0]
        context['posts'] = Post.objects.filter(author = user)
    
        if self.request.user.is_authenticated:
            context['you_follow'] = Follower.objects.filter(following=user, followed_by=self.request.user).exists()
        return context

class ProfilePersonalUpdate(UpdateView):
    template_name = "profiles/profile_update.html"
    model = Profile
    # form_class = UserForm
    fields = "__all__"
    success_url = "/"
    slug_field = "user_id"
    slug_url_kwarg = "user_id"
    def dispatch(self, request, *args, **kwargs):
        self.request = request
        return super().dispatch(request,*args,**kwargs)

    def get_context_data(self, **kwargs):
        user = self.request.user
        context = super().get_context_data(**kwargs)
        context['total_posts'] = Post.objects.filter(author = user).count()
        context['total_followers'] = Follower.objects.filter(following = user).count()
        context['total_following'] = Follower.objects.filter(followed_by = user).count()
        return context

    def form_valid(self, form):
        messages.success(self.request,'User Details Updated Successfully')
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
            notification = Notification.objects.create(
                notification_type = 3,
                from_user = request.user,
                to_user = other_user,

            )
            notification.save()
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




class ListThreads(View):
    template_name = "profiles/detail.html"
    def get(self, request, *args, **kwargs):
        threads = ThreadModel.objects.filter(Q(user = request.user) | Q(receiver = request.user))
    
        message_list = MessageModel.objects.all()
       
        context = {
            'threads' : threads,
            'message_list' :message_list,
        }

        return render(request,'includes/chat/inbox.html',context)
    
def ListThread(request):

    return render(request,'includes/chat/inbox.html')

class CreateThread(View):
    def get(self, request, *args, **kwargs):
        form = ThreadForm()
        
        context = {
            'form' : form,   
        }

        return render(request,'includes/chat/create_thread.html',context)
    def post(self, request, *args, **kwargs):
        form = ThreadForm(request.POST)
        username = request.POST.get('username')

        try:
            receiver = User.objects.get(username = username)
            if ThreadModel.objects.filter(user = request.user, receiver = receiver):
                threads = ThreadModel.objects.filter(user = request.user, receiver = receiver)[0]
                return redirect('profiles:thread', pk = threads.pk)
            elif ThreadModel.objects.filter(user = receiver, receiver = request.user).exists():
                   threads = ThreadModel.objects.filter(user = receiver, receiver = request.user)[0]
                   return redirect('profiles:thread', pk = threads.pk)
            if form.is_valid():
                threads = ThreadModel(
                    user = request.user,
                    receiver = receiver
                )
                threads.save()
                return redirect('profiles:thread', pk = threads.pk)

        except:
            return redirect('profiles:create_message')

class ThreadView(View):
    def get(self, request, pk, *args, **kwargs):
        form = MessageForm()
        thread = ThreadModel.objects.get(pk = pk)
        message_list = MessageModel.objects.filter(thread__pk__contains = pk)
        context = {
            'form' : form,
            'thread' : thread,
            'message_list' : message_list,
        }
        return render(request,'includes/chat/thread.html',context)

class ReadMessage(View):
    def get(self, request, pk, message_pk, *args, **kwargs):
        form = MessageForm()
        thread = ThreadModel.objects.get(pk = pk)
        message_list = MessageModel.objects.filter(thread__pk__contains = pk)
        message = MessageModel.objects.get(pk = message_pk)
        print("message from readmessage",message.body)
        message.is_read = True
        message.save()
        context = {
            'form' : form,
            'thread' : thread,
            'message_list' : message_list,
        }
        return render(request,'includes/chat/thread.html',context)
class CreateMessage(View):
    def post(self, request, pk, *args, **kwargs):
        form = MessageForm(request.POST,request.FILES)
        thread = ThreadModel.objects.get(pk = pk)
        receiver_user = request.POST['receiver_user']
        receiver = User.objects.get(id=receiver_user)
    
        print("thread:",thread)
        if thread.receiver == request.user:
            receiver = thread.user
        else:
            receiver = thread.receiver

     
        message = form.save(commit=False)
          
        message.thread = thread
        message.sended_user = request.user
        message.receiver_user = receiver
        message.save()
      
        print(form.errors)

        notification = Notification.objects.create(
            notification_type = 4,
            to_user = receiver,
            from_user = request.user,
            thread = thread,
            message = message,
            
        )
        notification.save()
     
        # print("receiver:",receiver_id)
    
        # return render(request,'includes/chat/thread.html',context)
        return redirect('profiles:thread', pk = pk)



def welcome_email(request,username):
    return render(request,'profiles/welcome_user_email.html')