from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import WorkViewSet

router = DefaultRouter()
router.register(r'Works', WorkViewSet)

urlpatterns = [
    path('', include(router.urls)),
]