from django import template
from django.http import request
from ..models import Post
register = template.Library()
@register.simple_tag
def setvar(val=None):

    return val

@register.inclusion_tag("like.html")
def show_likes():
    posts = Post.objects.all()
    return {'posts':posts}