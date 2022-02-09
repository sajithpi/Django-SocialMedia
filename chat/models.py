from asyncio.windows_events import NULL
from sqlite3 import Timestamp
from turtle import ondrag
from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver
from profiles.models import Profile
# Create your models here.

class Chat(models.Model):
    count = 0

    content = models.CharField(max_length=1555,null=True)
    photo = models.ImageField(upload_to="uploads/message_photos", blank = True, null = True)
    timestamp = models.DateTimeField(auto_now=True)
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name="+")
    receiver = models.ForeignKey(User, on_delete=models.CASCADE, related_name="+")
    room = models.ForeignKey('RoomChat',on_delete=models.CASCADE)
    is_read = models.BooleanField(default=False)

    def Counter(self):
        self.count += 1
        return self.count
    

class Chatroom(models.Model):
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name="+")
    receiver = models.ForeignKey(User, on_delete=models.CASCADE, related_name="+")
    
class RoomChat(models.Model):
    receiver = models.CharField(max_length=1055)
    sender = models.CharField(max_length=1055)
    sender_profile = models.ForeignKey(User,on_delete=models.CASCADE, related_name="+")
    receiver_profile = models.ForeignKey(User,on_delete=models.CASCADE, related_name="+")
    

class Connected(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="connected")
    room = models.ForeignKey(RoomChat, on_delete=models.CASCADE, related_name="connected")
    channel_name = models.CharField(max_length=100, null=False)
    connect_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.user.username