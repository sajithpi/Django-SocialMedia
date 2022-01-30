from re import U
from django.dispatch import receiver
from django.http import HttpResponse
from django.shortcuts import redirect, render
from django.db.models import Q
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib.auth.models import User
from django.views import View

from chat.models import Chat, Chatroom, RoomChat
# Create your views here.
def index(request):
    return render(request, 'chat/index.html')
class Index(LoginRequiredMixin, View):
    def get(self, request):
         return render(request, 'chat/index.html')
# def room(request, room_name):
#     return render(request, 'chat/room.html', {
#         'room_name': room_name
#     })
class Room(LoginRequiredMixin, View):
    def get(self, request, room_name):
        print("room name:",room_name)
        room = RoomChat.objects.filter(name=room_name).first()
        # room = RoomChat.objects.filter(Q(name = request.user.id) | Q(sender = request.user.id)).first()
        chats = []
        if room:
            chats = Chat.objects.filter(room=room)
        else:
            room = RoomChat(name=room_name)
            room.save()

        return render(request, 'chat/room.html', {
        'room_name': room_name, 'chats':chats,
    })

    # Using Sender and receiver
        # receiver = User.objects.get(username=room_name)
        # chats = []
       
           
        # if Chatroom.objects.filter(sender = request.user, receiver = receiver):
        #         room = Chatroom.objects.filter(sender=request.user,receiver=receiver).first()
        #         chats = Chat.objects.filter(room=room)
        #         print("im hereeee")
               
        #         # return redirect('profiles:thread', pk = threads.pk)
               
        # elif Chatroom.objects.filter(sender = receiver,receiver = request.user):
        #         room = Chatroom.objects.filter(sender = receiver,receiver = request.user).first()
        #         chats = Chat.objects.filter(room=room)
        #         print("im hereeaa")
        #         # return redirect('profiles:thread', pk = threads.pk)
        #         # return render(request, 'chat/room.html', {'room_name': room_name, 'chats':chats, 'room':room})
          

        # else:
        #         room = Chatroom(sender=request.user,receiver=receiver)
        #         room.save()
        #         # return render(request, 'chat/room.html', {'room_name': room_name, 'chats':chats, 'room':room})
       
        
        # return render(request, 'chat/room.html', {'room_name': room_name, 'chats':chats, 'room':room})
   
