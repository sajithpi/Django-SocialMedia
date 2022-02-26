from django.contrib import admin
from .models import Notification, Post, Like, Comment, Favorites, Stories

# Register your models here.

class PostAdmin(admin.ModelAdmin):
    pass
class LikeAdmin(admin.ModelAdmin):
    pass
class CommentAdmin(admin.ModelAdmin):
    pass

class NotificationAdmin(admin.ModelAdmin):
    pass

class StoriesAdmin(admin.ModelAdmin):
    list_display = ['author','text','created_time']

class FavoritesAdmin(admin.ModelAdmin):
    list_display = ['user','post']

admin.site.register(Post,PostAdmin)
admin.site.register(Like,LikeAdmin)
admin.site.register(Comment,CommentAdmin)
admin.site.register(Notification,NotificationAdmin)
admin.site.register(Favorites,FavoritesAdmin)
admin.site.register(Stories,StoriesAdmin)




