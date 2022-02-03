# chat/consumers.py
import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.dispatch import receiver
from django.http import request
from chat.models import Chat, Chatroom, RoomChat
from django.contrib.auth.models import User
class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = 'chat_%s' % self.room_name

        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        await self.accept()

        self.send(text_data=json.dumps({
            'type':'Connection Established',
            'message':'You are now connected',
        }))

    async def disconnect(self, close_code):
          # Leave room group
       await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']
        room_id = text_data_json['room_id']
        self.user_id = self.scope['user'].id
        # print("room_id:",room_id)
        print("message:",message)
        #Find room object

        room = await database_sync_to_async(RoomChat.objects.get)(id=room_id)
      
        # room = await database_sync_to_async(RoomChat.objects.get)(receiver=self.room_name)
        #Create new chat object
        
       
        

        
        sender_user = room.sender
        receiver_user = room.receiver
        
        if self.scope['user'].username == room.receiver:
            sender_user = room.receiver
            receiver_user = room.sender
            print("room sender_profile1:",sender_user)
            print("room receiver_profile1:",receiver_user)
            room.sender = sender_user
            room.receiver = receiver_user
            await database_sync_to_async(room.save)()
        elif self.scope['user'].username == room.sender:
            sender_user = room.sender
            receiver_user = room.receiver
            print("room sender_profile2:",sender_user)
            print("room receiver_profile2:",receiver_user)
            room.sender = sender_user
            room.receiver = receiver_user

            await database_sync_to_async(room.save)()
        received_user = await database_sync_to_async(User.objects.get)(username=receiver_user)
        chat = Chat(
            content = message,
            sender = self.scope['user'],
            receiver = received_user,
            room = room,
        )    
        await database_sync_to_async(chat.save)()

        
        # Send message to room group
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message,
                'user_id': self.user_id
                # 'room_id' : room_id,
            }
        )

     # Receive message from room group
    async def chat_message(self, event):
        message = event['message']
        user_id = event['user_id']
        # room_id = event['room_id']
         # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'message': message,
            'user_id': user_id
            # 'room_id' : room_id,
        }))