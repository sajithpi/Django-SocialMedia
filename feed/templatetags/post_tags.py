from django import template
from django.http import request
from ..models import Post
register = template.Library()
@register.simple_tag
def setvar(val=None):

    return val

