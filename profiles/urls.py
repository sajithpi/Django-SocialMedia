from django.urls import path 
from . import views

app_name = "profiles"

urlpatterns = [
 
    
    path("profile/<str:id>", views.ProfilePersonalUpdate.as_view(), name="update"),

    path("profile/<str:id>", views.ProfileLoginUpdate.as_view(), name="updatelogin"),
   
    path("profile/<str:username>/", views.UserDetailView.as_view(), name="user"),
 
    path("<str:username>/", views.ProfileDetailView.as_view(), name="detail"),

    path("<str:username>/follow/", views.FollowView.as_view(), name="follow"),

    path("til/templates/",views.PasswordsChangeView.as_view(),name="reset"),

    path('til/templates/account/',views.password_success,name="password_success"),

    
]
