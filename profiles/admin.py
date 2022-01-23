from django.contrib import admin
from .models import MessageModel, Profile, ThreadModel


class ProfileAdmin(admin.ModelAdmin):
    list_display = ['user','bio','gender','contact','place','country']
    
class ThreadModelAdmin(admin.ModelAdmin):
    list_display = ['user','receiver']

admin.site.register(Profile, ProfileAdmin)
admin.site.register(ThreadModel,ThreadModelAdmin)
admin.site.register(MessageModel)
