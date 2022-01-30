import imp
from django.urls import path

from chat import views

app_name="chat"

urlpatterns = [
    path("chat/index/",views.index,name="index"),
    path("chat/<str:room_name>/",views.Room.as_view(),name="room"),
]