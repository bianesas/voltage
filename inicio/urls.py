from django.urls import path
from django.contrib.auth import views as auth_views
from django.views.generic import TemplateView
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('home/', views.home, name='home'),
    path('login/', auth_views.LoginView.as_view(template_name='login.html'), name='login'),
    path('logout/', auth_views.LogoutView.as_view(), name='logout'),
    path('signup/', views.signup, name='signup'),
    # Static content pages should use TemplateView (render templates directly)
    path('paneles/', TemplateView.as_view(template_name='paneles.html'), name='paneles'),
    path('hibrido/', TemplateView.as_view(template_name='hibrido.html'), name='hibrido'),
    path('ongrid/', TemplateView.as_view(template_name='ongrid.html'), name='ongrid'),
    path('offgrid/', TemplateView.as_view(template_name='offgrid.html'), name='offgrid'),
    path('about/', TemplateView.as_view(template_name='about.html'), name='about'),
]