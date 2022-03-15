from django import template
from django.http import request
from ..models import Post
from feed.models import Favorites
register = template.Library()
@register.simple_tag
def setvar(val=None):

    return val

@register.simple_tag
def favorites_post_check(post_id,user_id):
    try:
        favorites = Favorites.objects.get(post__id = post_id,user_id = user_id)
        return 'bx bxs-star'
    except Favorites.DoesNotExist:
        return "bx bx-star"
  
