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
        # Validar que la fecha y hora seleccionadas estén dentro del horario disponible de la manicurista
        if self.fecha_cita and self.hora_cita:
            date_key = self.fecha_cita.strftime('%Y-%m-%d')
            if self.manicurista.horario_disponible and date_key in self.manicurista.horario_disponible:
                details = self.manicurista.horario_disponible[date_key]
                if not details['status'] or self.hora_cita.strftime('%H:%M') not in details['hours']:
                    raise ValueError("La fecha y hora seleccionadas no están disponibles.")
            else:
                raise ValueError("La fecha seleccionada no está disponible.")
        else:
            # Asignar fecha_cita y hora_cita antes de guardar si no están definidos
            if not self.fecha_cita:
                self.fecha_cita = self.get_fecha_cita()
            if not self.hora_cita:
                self.hora_cita = self.get_hora_cita()
            if not self.fecha_cita or not self.hora_cita:
                raise ValueError("No hay disponibilidad para la cita.")

        super().save(*args, **kwargs)