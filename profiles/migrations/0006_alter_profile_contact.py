# Generated by Django 3.2.9 on 2021-12-17 13:36

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('profiles', '0005_profile_contact'),
    ]

    operations = [
        migrations.AlterField(
            model_name='profile',
            name='contact',
            field=models.IntegerField(max_length=100),
        ),
    ]
