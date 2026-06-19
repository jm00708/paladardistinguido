from django.urls import path
from rest_framework import generics, permissions
from .models import Restaurant
from rest_framework import serializers


class RestaurantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Restaurant
        fields = ['id', 'name', 'city', 'zone', 'language', 'subscription_active']


class RestaurantListView(generics.ListAPIView):
    serializer_class = RestaurantSerializer
    permission_classes = [permissions.IsAdminUser]
    queryset = Restaurant.objects.all()


urlpatterns = [
    path('', RestaurantListView.as_view()),
]
