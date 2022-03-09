from base64 import urlsafe_b64encode
from xml.etree.ElementInclude import include
from django.contrib.auth.models import User
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.template.loader import render_to_string,get_template
from django.utils.http import urlsafe_base64_encode,urlsafe_base64_decode
from django.utils.encoding import force_bytes
from django.contrib.auth.tokens import default_token_generator
from django.core.mail import EmailMessage,message
from django.contrib.sites.shortcuts import get_current_site
from django.core.mail import EmailMultiAlternatives
from pathlib import Path
from sorl.thumbnail import ImageField


class Profile(models.Model):
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="profile"
    )
    image = ImageField(default="profiles/user.png",upload_to='profiles')
    gender = models.CharField(null=True,blank=True,max_length=100)
    # dob = models.DateTimeField(auto_created=True)
    bio = models.TextField(null=True,blank=True,max_length=255)
    contact = models.IntegerField(null=True,blank=True,default=1)

    place = models.CharField(null=True,blank=True,max_length=100)
    state = models.CharField(null=True,blank=True,max_length=100)
    country = models.CharField(null=True,blank=True,max_length=100)
   

    def __str__(self):
        return self.user.username


@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    """Create a new Profile() object when a Django User is created."""
    if created:
        Profile.objects.create(user=instance)
        # current_site = get_current_site(instance)
        # mail_subject = 
        # html_content = '<p>This is an <strong>important</strong> message.</p>'
        # message = render_to_string('profiles/welcome_email.html',{
        #     'user':instance,
        #     'domain':current_site,
        #     'uid':urlsafe_base64_encode(force_bytes(instance.id)),
        #     'token':default_token_generator.make_token(instance),
        # })
        
        # send_email = EmailMessage(mail_subject,message,to=[to_email])
        
        # send_email.send()

        to_email = instance.email
        subject, from_email, to = 'Welcome to SocialBook Family', 'hellosocialbook@gmail.com', to_email
        text_content = 'Hi.'
        # html_content = render_to_string('profiles/welcome_user_email.html')
        context_data = {'name':instance.username}
        html = get_template('profiles/welcome_user_email.html')
        html_content = html.render(context_data)

        msg = EmailMultiAlternatives(subject, html_content, from_email, [to])
        # msg.attach_alternative(html_content, "text/html")
        msg.content_subtype = 'html'
        msg.send(fail_silently=False)
class ThreadModel(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="+")
    receiver = models.ForeignKey(User, on_delete=models.CASCADE, related_name="+")
class MessageModel(models.Model):
    thread = models.ForeignKey(ThreadModel, related_name="+", on_delete=models.CASCADE, null=True, blank=True)
    sended_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="+")
    receiver_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="+")
    body = models.CharField(max_length=1555)
    image = models.ImageField(upload_to="uploads/message_photos", blank=True, null = True)
    date = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)
