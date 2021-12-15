from django import forms
from django.forms import fields
from .models import Post

class PhotoForm(forms.ModelForm):
    class Meta:
        model = Post
        fields = ('text','photo')