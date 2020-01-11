# accounts/views.py
from django.contrib.sites.shortcuts import get_current_site
from django.shortcuts import render, redirect
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode
from django.utils.http import urlsafe_base64_decode
from django.template.loader import render_to_string
from . import tokens
from django.contrib.auth import login
from django.contrib.auth.models import User
from django.utils.encoding import force_text
from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.core.mail import send_mail
from django.conf import settings


class SignUpForm(UserCreationForm):
    first_name = forms.CharField(max_length=30, required=False, help_text='Optional.')
    last_name = forms.CharField(max_length=30, required=False, help_text='Optional.')
    email = forms.EmailField(max_length=254, help_text='Required. Inform a valid email address.')

    class Meta:
        model = User
        fields = ('username', 'first_name', 'last_name', 'email', 'password1', 'password2', )

def SignUp(request):
    if request.method == 'POST':
        form = SignUpForm(request.POST)
        if form.is_valid():
            user = form.save(commit=False)
            user.is_active = False
            user.save()
            current_site = get_current_site(request)
            subject = 'Activate Your Meal Creator Account'
            message = render_to_string('account_activation_email.html', {
                'user': user,
                'domain': current_site.domain,
                'uid':urlsafe_base64_encode(force_bytes(user.pk)).decode(),
                'token':tokens.account_activation_token.make_token(user),
            })
            #user.email_user(subject, message)
            from_email = settings.DEFAULT_FROM_EMAIL
            send_mail(subject, message, from_email, [user.email], fail_silently=False)

            return redirect('account_activation_sent')

    else:
        form = SignUpForm()
    return render(request, 'signup.html', {'form': form})

def activate(request,uidb64, token):
    try:
        uid = force_text(urlsafe_base64_decode(uidb64))
        user = User.objects.get(pk=uid)
    except(TypeError, ValueError, OverflowError, User.DoesNotExist):
        user = None
    if user is not None and tokens.account_activation_token.check_token(user, token):
        user.is_active = True
        user.save()
        login(request, user)
        return redirect('Home')
    else:
        return render(request, "account_activation_invalid.html")


def account_activation_sent(request):
    return render(request, "account_activation_sent.html")
def account_activation_invalid(request):
    return render(request, "account_activation_invalid.html")
