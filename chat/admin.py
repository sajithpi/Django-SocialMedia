from django.contrib import admin
from chat.models import Chat, Chatroom, RoomChat
# Register your models here.

class ChatAdmin(admin.ModelAdmin):
    list_display = ['sender','receiver','content','timestamp','is_read']

class RoomChatAdmin(admin.ModelAdmin):
    list_display = ['sender','receiver']

admin.site.register(Chat,ChatAdmin)
admin.site.register(Chatroom)
admin.site.register(RoomChat,RoomChatAdmin)