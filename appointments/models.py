from django.db import models
from clients.models import Client
from manicurists.models import Manicurist

class Appointment(models.Model):
    ESTADOS = (
        ('pendiente', 'Pendiente'),
        ('confirmada', 'Confirmada'),
        ('cancelada', 'Cancelada'),
    )
    cliente = models.ForeignKey(Client, on_delete=models.CASCADE, related_name='appointments')
    manicurista = models.ForeignKey(Manicurist, on_delete=models.CASCADE, related_name='appointments')
    fecha_cita = models.DateField(blank=True, null=True)
    hora_cita = models.TimeField(blank=True, null=True)
    estado = models.CharField(max_length=10, choices=ESTADOS, default='pendiente')
    notas = models.TextField(blank=True, null=True)

    class Meta:
        unique_together = ('manicurista', 'fecha_cita', 'hora_cita')  # Evita citas duplicadas

    def __str__(self):
        return f"Cita de {self.cliente.usuario.username} con {self.manicurista.usuario.username}"

    def get_fecha_cita(self):
        # Extraer la primera fecha disponible del JSONField
        if self.manicurista.horario_disponible:
            for date, details in self.manicurista.horario_disponible.items():
                if details['status']:
                    return date
        return None

    def get_hora_cita(self):
        # Extraer la primera hora disponible del JSONField
        if self.manicurista.horario_disponible:
            for date, details in self.manicurista.horario_disponible.items():
                if details['status'] and details['hours']:
                    return details['hours'][0]
        return None

    def save(self, *args, **kwargs):
        # Validar que la manicurista tenga horario disponible
        if not self.manicurista.horario_disponible:
            raise ValueError("La manicurista no tiene horario configurado.")

        # Convertir fecha_cita a string para coincidir con la clave del JSON
        date_key = self.fecha_cita.strftime("%Y-%m-%d")  # Formato: "2023-10-25"

        # Verificar si la fecha está en el horario_disponible y está habilitada
        if date_key not in self.manicurista.horario_disponible:
            raise ValueError("La fecha seleccionada no está disponible.")
        
        fecha_data = self.manicurista.horario_disponible[date_key]
        
        if not fecha_data["status"]:
            raise ValueError("La fecha está marcada como no disponible.")

        # Convertir hora_cita a string (ej: "10:00")
        hora_str = self.hora_cita.strftime("%H:%M")

        # Verificar si la hora está en las horas disponibles
        if hora_str not in fecha_data["hours"]:
            raise ValueError("La hora seleccionada no está disponible.")

        # Guardar la cita si pasa todas las validaciones
        super().save(*args, **kwargs)