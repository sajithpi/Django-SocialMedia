# Generated by Django 3.2.9 on 2021-12-17 13:33

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('profiles', '0004_auto_20211216_1148'),
    ]

    operations = [
        migrations.AddField(
            model_name='profile',
            name='contact',
            field=models.TextField(default=1, max_length=100),
            preserve_default=False,
        ),
    ]
