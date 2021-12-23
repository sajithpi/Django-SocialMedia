from django import forms
from django.forms import fields
from .models import Comment, Post

class PhotoForm(forms.ModelForm):
    class Meta:
        model = Post
        fields = ('text','photo')

class CommentForm(forms.ModelForm):
    content = forms.CharField(label='test label',
                            widget=forms.TextInput(attrs={'placeholder':'Add a comment here'}))
    class Meta:
        model = Comment
        fields = ('content',)