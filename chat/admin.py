from django.contrib import admin
from chat.models import Chat, Chatroom, RoomChat
# Register your models here.

admin.site.register(Chat)
admin.site.register(Chatroom)
admin.site.register(RoomChat)