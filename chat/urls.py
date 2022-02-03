import imp
from django.urls import path

from chat import views

app_name="chat"

urlpatterns = [
    path("chat/index/",views.Index.as_view(),name="index"),
    path("chat/<str:room_name>/",views.Room.as_view(),name="room"),
     path("chat/is_read/<str:room_name>/",views.MessageReadSet.as_view(),name="message"),
]