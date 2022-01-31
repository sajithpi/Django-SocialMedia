# chat/consumers.py
import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from chat.models import Chat, Chatroom, RoomChat
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
        # room_id = text_data_json['room_id']
        self.user_id = self.scope['user'].id
        # print("room_id:",room_id)
        print("message:",message)

        #Find room object

        room = await database_sync_to_async(RoomChat.objects.get)(id=self.room_name)
        # room = await database_sync_to_async(RoomChat.objects.get)(receiver=self.room_name)
        #Create new chat object
        chat = Chat(
            content = message,
            user = self.scope['user'],
            room = room
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