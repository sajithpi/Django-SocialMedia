from django.shortcuts import render
from feed.models import Notification
def notification_counts(request):
    if request.user.is_authenticated:
        notifications = Notification.objects.filter(to_user=request.user,user_has_seen=False)
        notification_count = notifications.count()
        return {'notifications' : notifications,'notification_count' : notification_count,}
    return {}

    