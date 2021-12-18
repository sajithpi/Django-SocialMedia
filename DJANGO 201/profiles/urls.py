from django.urls import path

from . import views

app_name = "profiles"

urlpatterns = [
       path("profile/<str:pk>", views.ProfileUpdate.as_view(), name="update"),
    path("profile/<str:username>/", views.UserDetailView.as_view(), name="user"),
 
    path("<str:username>/", views.ProfileDetailView.as_view(), name="detail"),

    path("<str:username>/follow/", views.FollowView.as_view(), name="follow"),
]
