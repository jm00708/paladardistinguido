from django.urls import path
from .views import DinerProfileView, GuestSessionView, QuestionnaireView, RegisterDinerView

urlpatterns = [
    path('guest/', GuestSessionView.as_view()),
    path('register/', RegisterDinerView.as_view()),
    path('<int:diner_id>/questionnaire/', QuestionnaireView.as_view()),
    path('profile/', DinerProfileView.as_view()),
]
