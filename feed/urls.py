from django.urls import path

from . import views
from django.conf import settings
from django.conf.urls.static import static

app_name = "feed"

urlpatterns = [
   
    # path("",views.HomePage.as_view(),name="home"),
    path("",views.Comment_post,name="home"),
    path("<int:pk>/",views.PostDetailView.as_view(),name="detail"),
    path("find/",views.FindFriends.as_view(),name="find"),
    path("uploadPost/",views.UploadPost.as_view(),name="new_post"),
    path("like/",views.Like_post ,name="like_post"),
    path("delete/",views.delete_post,name="delete")

   
]
urlpatterns += static(settings.STATIC_URL,document_root=settings.STATIC_ROOT)