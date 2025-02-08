from rest_framework import serializers
from .models import Manicurist

class ManicuristSerializer(serializers.ModelSerializer):
    class Meta: 
        model = Manicurist
        fields = '__all__'