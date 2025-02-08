from django.shortcuts import render
from rest_framework import viewsets
from .models import Manicurist
from .serializers import ManicuristSerializer

# Create your views here.

class ManicuristViewSet(viewsets.ModelViewSet):
    queryset = Manicurist.objects.all()
    serializer_class = ManicuristSerializer