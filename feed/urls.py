from django.urls import path

from . import views
from django.conf import settings
from django.conf.urls.static import static

app_name = "feed"

urlpatterns = [
   
    # path("",views.HomePage.as_view(),name="home"),
    path("",views.HomePage.as_view(),name="home"),
    path("<int:pk>/",views.PostDetailView.as_view(),name="detail"),
    path("find/",views.FindFriends.as_view(),name="find"),
    path("uploadPost/",views.UploadPost.as_view(),name="new_post"),
    path("like/",views.Like_post ,name="like_post"),
    path("delete/",views.delete_post,name="delete"),
    path("update/",views.updatePost,name="update"),
    path("search/",views.FindFriends.as_view(),name="search"),
    path("comment/",views.Comment_post,name="comment"),
    path("favorites/",views.AddFavorites,name="add_to_favorites"),
    path('search_rooms/',views.Search_Room,name="search_room"),
    path("notification/<int:notification_pk>/post/<int:post_pk>",views.post_notification,name="post_notification"),
    path("notification/<int:notification_pk>/user_profile/<str:user_pk>",views.user_profile_notification,name="user_profile_notification"),
    path("delete_comment/",views.delete_comment,name="delete_comment"),
    path("update_comment/",views.update_comment,name="update_comment"),
   


   
]
urlpatterns += static(settings.STATIC_URL,document_root=settings.STATIC_ROOT)