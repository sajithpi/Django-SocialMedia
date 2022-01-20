from django.db import models
from django.contrib.auth.models import User
from profiles.models import Profile
from django.db.models.deletion import CASCADE
from sorl.thumbnail import ImageField
from django.dispatch import receiver
from django.db.models.signals import post_save
# Create your models here.

class Post(models.Model):
    text = models.CharField(max_length=255)
    date_time = models.DateTimeField(auto_now=True)
    photo = ImageField()
    author = models.ForeignKey(
        User,
        on_delete=models.CASCADE,

    )
    likes = models.ManyToManyField(User, related_name="likes")
    


    def __str__(self):
        return self.text[0:100]

    @property
    def total_like(self):
        return self.likes.all().count()

    
STATUS =  (
        ('Like','Like'),
        ('Dislike','Dislike'),
    )

class Like(models.Model):
    user = models.ForeignKey(User,on_delete=CASCADE)
    post = models.ForeignKey(Post,on_delete=CASCADE)
    value = models.CharField(choices=STATUS,default='Like',max_length=9)
    
    def __str__(self):
       return str(self.post) 

class Comment(models.Model):
    
    user = models.ForeignKey(Profile,on_delete=CASCADE)
    post = models.ForeignKey(Post,on_delete=CASCADE)
    content = models.TextField(max_length=255)
    created = models.DateTimeField(auto_now=True)

    def __str__(self):
        return str(self.content)


class Notification(models.Model):

    notification_type = models.IntegerField()
    to_user = models.ForeignKey(User, related_name="notification_to", on_delete=models.CASCADE, null=True)
    from_user = models.ForeignKey(User, related_name="notification_from" ,on_delete=models.CASCADE, null=True)
    post = models.ForeignKey(Post, related_name="+", on_delete=models.CASCADE,null=True, blank=True)
    profile = models.ForeignKey(Profile,on_delete=models.CASCADE,null=True,blank=True)
    date = models.DateTimeField(auto_now_add=True)
    user_has_seen = models.BooleanField(default=False)
