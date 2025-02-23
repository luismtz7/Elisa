from django.apps import apps
from rest_framework import viewsets, status
from rest_framework.response import Response
from .models import Appointment
from .serializers import AppointmentSerializer

class AppointmentViewSet(viewsets.ModelViewSet):
    """
    ViewSet que maneja la obtención de citas disponibles y permite CRUD completo.
    """
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer

    def list(self, request, *args, **kwargs):
        """Devuelve solo las fechas y horas disponibles en horario_disponible de los manicuristas."""
        Manicurist = apps.get_model('manicurists', 'Manicurist')

        manicurists_with_availability = Manicurist.objects.filter(horario_disponible__isnull=False)
        available_appointments = []

        for manicurist in manicurists_with_availability:
            horario_disponible = manicurist.horario_disponible  # JSONField (diccionario)
            for date, details in horario_disponible.items():
                if details.get("status", False) and details.get("hours"):  # Si hay horarios disponibles
                    for hour in details["hours"]:  # Iterar sobre cada hora disponible
                        available_appointments.append({
                            "manicurist": manicurist.id,
                            "date": date,
                            "time": hour
                        })

        return Response(available_appointments)

    def create(self, request, *args, **kwargs):
        """Crea una nueva cita solo si la fecha y hora están en el horario_disponible del manicurista."""
        Manicurist = apps.get_model('manicurists', 'Manicurist')
        serializer = AppointmentSerializer(data=request.data)

        if serializer.is_valid():
            manicurist = Manicurist.objects.get(id=request.data['manicurist'])
            date_str = request.data['date']
            time_str = request.data['time']

            # Verificar si el horario está disponible
            horario_disponible = manicurist.horario_disponible.get(date_str, {})
            if not horario_disponible.get("status", False) or time_str not in horario_disponible.get("hours", []):
                return Response({"error": "Este horario no está disponible"}, status=status.HTTP_400_BAD_REQUEST)

            # Crear la cita
            appointment = serializer.save()

            # Actualizar el horario del manicurista
            horario_disponible["hours"].remove(time_str)
            if not horario_disponible["hours"]:  # Si no quedan horarios, desactivar el día
                horario_disponible["status"] = False
            manicurist.horario_disponible[date_str] = horario_disponible
            manicurist.save()

            return Response(AppointmentSerializer(appointment).data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, *args, **kwargs):
        """Actualiza una cita existente."""
        return super().update(request, *args, **kwargs)

    def partial_update(self, request, *args, **kwargs):
        """Actualización parcial de una cita (PATCH)."""
        return super().partial_update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        """Elimina una cita existente."""
        return super().destroy(request, *args, **kwargs)
