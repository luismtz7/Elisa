from django.db import models
from clients.models import Client
from manicurists.models import Manicurist

# Create your models here.
class Appointment(models.Model):
    ESTADOS = (
        ('pendiente', 'Pendiente'),
        ('confirmada', 'Confirmada'),
        ('cancelada', 'Cancelada'),
    )
    cliente = models.ForeignKey(Client, on_delete=models.CASCADE, related_name='appointments')
    manicurista = models.ForeignKey(Manicurist, on_delete=models.CASCADE, related_name='appointments')
    fecha_cita = models.DateField()
    hora_cita = models.TimeField()
    estado = models.CharField(max_length=10, choices=ESTADOS, default='pendiente')
    notas = models.TextField(blank=True, null=True)

    class Meta:
        unique_together = ('manicurista', 'fecha_cita', 'hora_cita')  # Evita citas duplicadas

    def __str__(self):
        return f"Cita de {self.cliente.usuario.username} con {self.manicurista.usuario.username}"