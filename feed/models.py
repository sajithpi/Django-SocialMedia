from django.db import models
from sorl.thumbnail import ImageField
# Create your models here.

class Post(models.Model):
    text = models.CharField(max_length=255)
    date_time = models.DateTimeField(auto_now=True)
    photo = ImageField()


    def __str__(self):
        return self.text[0:100]