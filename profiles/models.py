from django.contrib.auth.models import User
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver
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
   
    country = models.CharField(null=True,blank=True,max_length=100)
   

    def __str__(self):
        return self.user.username


@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    """Create a new Profile() object when a Django User is created."""
    if created:
        Profile.objects.create(user=instance)
