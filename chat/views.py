
import profile
from django.dispatch import receiver
from django.http import HttpResponse
from django.shortcuts import redirect, render
from django.db.models import Q
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib.auth.models import User
from profiles.models import Profile
from django.views import View

from chat.models import Chat, Chatroom, RoomChat
# Create your views here.
def index(request):
    return render(request, 'chat/index.html')
class Index(LoginRequiredMixin, View):
    def get(self, request):
        rooms = RoomChat.objects.filter(Q(sender = request.user.username) | Q(receiver = request.user.username))
        # rooms = RoomChat.objects.all()
        message_list = Chat.objects.all()
        context = {
            'rooms' : rooms,
            'message_list' :message_list,
        }
        return render(request, 'chat/index.html',context)
# def room(request, room_name):
#     return render(request, 'chat/room.html', {
#         'room_name': room_name
#     })
class Room(LoginRequiredMixin, View):
    def get(self, request, room_name):
        print("room name:",room_name)
    #     room = RoomChat.objects.filter(receiver=room_name).first()
    #     # room = RoomChat.objects.filter(Q(name = request.user.id) | Q(sender = request.user.id)).first()
    #     chats = []
    #     if room:
    #         chats = Chat.objects.filter(room=room)
    #     else:
    #         room = RoomChat(receiver=room_name,sender=request.user.username)
    #         room.save()

    #     return render(request, 'chat/room.html', {
    #     'room_name': room_name, 'chats':chats,
    # })

    # Using Sender and receiver
        # receiver = User.objects.get(username=room_name)
        receiver = room_name
        try:
            received_user = User.objects.get(username=room_name)
        except Profile.DoesNotExist:
            received_user = None

        chats = []
       
           
        if RoomChat.objects.filter(sender = request.user.username, receiver = receiver):
                room = RoomChat.objects.filter(sender=request.user.username,receiver=receiver).first()
                chats = Chat.objects.filter(room=room)
                room_name = room.id
                print("im hereeee")
               
                # return redirect('profiles:thread', pk = threads.pk)
               
        elif RoomChat.objects.filter(sender = receiver,receiver = request.user):
                room = RoomChat.objects.filter(sender = receiver,receiver = request.user.username).first()
                chats = Chat.objects.filter(room=room)
                room_name = room.id
                print("im hereeaa")
                # return redirect('profiles:thread', pk = threads.pk)
                # return render(request, 'chat/room.html', {'room_name': room_name, 'chats':chats, 'room':room})
          

        else:
                room = RoomChat(sender=request.user.username,receiver=receiver,sender_profile=request.user, receiver_profile = received_user)
                room.save()
                # return render(request, 'chat/room.html', {'room_name': room_name, 'chats':chats, 'room':room})
       
        
        return render(request, 'chat/room.html', {'room_name': room_name, 'chats':chats, 'room':room, 'received_user':received_user})
   
