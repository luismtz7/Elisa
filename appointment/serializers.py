from rest_framework import serializers
from .models import Appointment
from django.apps import apps

class AppointmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Appointment
        fields = '__all__'
    
    def validate(self, data):
        """Verifica que el horario está disponible antes de crear la cita."""
        Manicurist = apps.get_model('manicurist', 'Manicurist')
        manicurist = Manicurist.objects.get(id=data['manicurist'].id)
        date_str = str(data['date'])
        time_str = data['time'].strftime("%H:%M")

        available_slots = manicurist.horario_disponible.get(date_str, {}).get("hours", [])
        if time_str not in available_slots:
            raise serializers.ValidationError("El horario seleccionado no está disponible.")

        return data
