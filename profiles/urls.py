from django.urls import path 
from . import views

app_name = "profiles"

urlpatterns = [
 
    
    path("profile/<str:user_id>", views.ProfilePersonalUpdate.as_view(), name="update"),

    path("profile/<str:id>", views.ProfileLoginUpdate.as_view(), name="updatelogin"),
   
    path("<str:username>/", views.ProfileDetailView.as_view(), name="user_profile"),

    path("<str:username>/follow/", views.FollowView.as_view(), name="follow"),

    path("til/templates/",views.PasswordsChangeView.as_view(),name="reset"),

    path('til/templates/account/',views.password_success,name="password_success"),

    path('inbox/chat/',views.ListThreads.as_view(),name="inbox"),

    path('inbox/create_thread/',views.CreateThread.as_view(),name="create_thread"),

    path('inbox/<int:pk>/',views.ThreadView.as_view(),name="thread"),

    path('inbox/<int:pk>/<int:message_pk>',views.ReadMessage.as_view(),name="read_message"),

    path('inbox/<int:pk>/create_message/',views.CreateMessage.as_view(),name="create_message"),

    path("<str:username>/welcome/",views.welcome_email,name="welcome"),
    
]
