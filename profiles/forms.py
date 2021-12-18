from django import forms
from .models import Profile
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
    

    
    