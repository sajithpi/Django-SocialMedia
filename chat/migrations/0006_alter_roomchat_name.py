# Generated by Django 3.2 on 2022-01-30 17:01

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('chat', '0005_auto_20220130_2228'),
    ]

    operations = [
        migrations.AlterField(
            model_name='roomchat',
            name='name',
            field=models.CharField(max_length=255),
        ),
    ]