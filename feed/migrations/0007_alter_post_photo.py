# Generated by Django 3.2.9 on 2021-12-14 17:37

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('feed', '0006_alter_post_photo'),
    ]

    operations = [
        migrations.AlterField(
            model_name='post',
            name='photo',
            field=models.ImageField(upload_to='images'),
        ),
    ]
