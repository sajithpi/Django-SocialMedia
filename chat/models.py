from sqlite3 import Timestamp
from django.db import models
from django.contrib.auth.models import User
# Create your models here.

class Chat(models.Model):
    content = models.CharField(max_length=1555)
    timestamp = models.DateTimeField(auto_now=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    room = models.ForeignKey('RoomChat',on_delete=models.CASCADE)

class Chatroom(models.Model):
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name="+")
    receiver = models.ForeignKey(User, on_delete=models.CASCADE, related_name="+")
    
class RoomChat(models.Model):
    receiver = models.CharField(max_length=1055)
    sender = models.CharField(max_length=1055)