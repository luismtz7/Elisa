from django.shortcuts import render
from rest_framework import viewsets
from .models import Work
from .serializers import WorkSerializer

# Create your views here.

class WorkViewSet(viewsets.ModelViewSet):
    queryset = Work.objects.all()
    serializer_class = WorkSerializer
    
