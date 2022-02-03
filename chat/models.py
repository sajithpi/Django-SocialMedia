from asyncio.windows_events import NULL
from sqlite3 import Timestamp
from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver
from profiles.models import Profile
# Create your models here.

class Chat(models.Model):
    count = 0

    content = models.CharField(max_length=1555,null=True,default=NULL)
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
    
