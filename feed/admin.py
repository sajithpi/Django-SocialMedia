from django.contrib import admin
from .models import Post, Like, Comment

# Register your models here.

class PostAdmin(admin.ModelAdmin):
    pass
class LikeAdmin(admin.ModelAdmin):
    pass
class CommentAdmin(admin.ModelAdmin):
    pass


admin.site.register(Post,PostAdmin)
admin.site.register(Like,LikeAdmin)
admin.site.register(Comment,CommentAdmin)


