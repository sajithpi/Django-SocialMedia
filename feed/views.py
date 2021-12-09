from django.views.generic import ListView
from django.views.generic.edit import CreateView
from .models import Post
from feed import models
from django.contrib.auth.mixins import LoginRequiredMixin

# Create your views here.

class HomePage(ListView):
    http_method_names = ["get"]
    template_name = "feed/homepage.html"
    model = Post
    context_object_name = "posts"
    queryset = Post.objects.all().order_by('-id')[0:30]

class UploadPost(LoginRequiredMixin,CreateView):
    model = Post
    http_method_names = ["get"]
    template_name = "feed/uploadPost.html"
    fields = ['text','photo']

    
    

