from atexit import register
import imp
from django import template
from django.http import request
from feed.models import Notification
from profiles.models import MessageModel, Profile

register = template.Library()

@register.inclusion_tag('feed/show_notification.html', takes_context=True)
def show_notifications(context):
    request_user = context['request'].user
    print("request_user:",request_user)
    notifications = Notification.objects.filter(to_user = request_user).exclude(user_has_seen=True).order_by('-date')

    return {"notifications":notifications}
@register.inclusion_tag('feed/show_message_notification.html', takes_context=True)
def show_message_notifications(context):
    request_user = context['request'].user
    print("request_user:",request_user)
    notifications = Notification.objects.filter(to_user = request_user,message__is_read = False).order_by('-date')
    return {"notifications":notifications}