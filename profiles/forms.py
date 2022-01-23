from django import forms
from .models import MessageModel, Profile, ThreadModel
class UserForm(forms.ModelForm):
    class Meta:
        model = Profile
        # name = forms.CharField()
        # image = forms.FileField()
        # age = forms.IntegerField()
        # email = forms.EmailField()
        # place = forms.CharField()
        # occupation = forms.CharField()
        # fields = ('name', 'image', 'age', 'email', 'place', 'occupation','gender')
        fields = ('user','image','gender','contact','place','country')

        widgets={
            'user' : forms.TextInput(attrs={'class':'form-control','placeholder':'Username'}),
            'image' : forms.FileInput(attrs={'class':'form-control','placeholder':'Image Url'}),
            'gender' : forms.TextInput(attrs={'class':'form-control','placeholder':'Gender'}),
            # 'dob' : forms.DateInput(attrs={'class':'form-control','placeholder':'Dob'}),
            'contact' : forms.NumberInput(attrs={'class':'form-control','placeholder':'Contact'}),
            'place' : forms.TextInput(attrs={'class':'form-control','placeholder':'Place'}),
            'country' : forms.TextInput(attrs={'class':'form-control','placeholder':'Place'}),
           

        }
    

    
class ThreadForm(forms.Form):
    username = forms.CharField(label='',max_length=100)

class MessageForm(forms.ModelForm):
    
    
    class Meta:
        model = MessageModel
        fields = ['sended_user','receiver_user','body','image']
        # fields = '__all__'