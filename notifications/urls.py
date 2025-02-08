from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import NotificationViewSet

router = DefaultRouter()
router.register(r'Notifications', NotificationViewSet)

urlpatterns = [
    path('', include(router.urls)),
]