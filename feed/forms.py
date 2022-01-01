from django import forms
from django.forms import fields
from django.forms.models import ALL_FIELDS
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

class PostForm(forms.ModelForm):
    class Meta:
        model = Post
        fields = '__all__'