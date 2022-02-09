from django.shortcuts import render
from feed.models import Notification
def notification_counts(request):
    if request.user.is_authenticated:
        notifications = Notification.objects.filter(to_user = request.user,user_has_seen=False,message = None)
        notification_count = notifications.count()
        for notification in notifications:
            if notification.from_user == request.user:
                print("Notification user is same:",notification.from_user)
                notification_count -= 1
        
        return {'notifications' : notifications,'notification_count' : notification_count,}
    return {}


    