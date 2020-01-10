from django.urls import path,re_path
from django.conf.urls import url

from . import views

urlpatterns = [
    path('signup/', views.SignUp, name='signup'),
    path('account_activation_sent/', views.account_activation_sent, name='account_activation_sent'),
    path('account_activation_invalid/', views.account_activation_invalid, name='account_activation_invalid'),
    re_path(r'^activate/(?P<uidb64>[0-9A-Za-z_\-]+)/(?P<token>[0-9A-Za-z]{1,13}-[0-9A-Za-z]{1,20})/$',
        views.activate, name='activate'),
]
