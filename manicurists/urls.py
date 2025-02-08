from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ManicuristViewSet

router = DefaultRouter()
router.register(r'Manicurists', ManicuristViewSet)

urlpatterns = [
    path('', include(router.urls)),
]