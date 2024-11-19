from django.urls import path
from .views import RegisterView, LoginView, UserView, LogoutView, UserLiteView

urlpatterns = [
    path('register', RegisterView.as_view()),
    path('login', LoginView.as_view()),
    path('get_current_user', UserView.as_view()),
    path('logout', LogoutView.as_view()),
     path('get_users', UserLiteView.as_view()),
]