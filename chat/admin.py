from django.contrib import admin
from chat.models import Chat, Chatroom, RoomChat, Connected
# Register your models here.

class ChatAdmin(admin.ModelAdmin):
    list_display = ['sender','receiver','content','timestamp','is_read']

class RoomChatAdmin(admin.ModelAdmin):
    list_display = ['sender','receiver']
class ConnectedAdmin(admin.ModelAdmin):
    list_display = ['user','room_id','channel_name','connect_date']

admin.site.register(Chat,ChatAdmin)
admin.site.register(Chatroom)
admin.site.register(RoomChat,RoomChatAdmin)
admin.site.register(Connected,ConnectedAdmin)