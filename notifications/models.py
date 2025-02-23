
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver
from users.models import User
from appointment.models import Appointment
# Create your models here.


class Notification(models.Model):
    usuario = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    mensaje = models.TextField()
    fecha_envio = models.DateTimeField(auto_now_add=True)
    leida = models.BooleanField(default=False)

    def __str__(self):
        return f"Notificación para {self.usuario.username}"

# Señal para enviar notificaciones cuando se agenda una cita
@receiver(post_save, sender=Appointment)
def enviar_notificacion_cita(sender, instance, created, **kwargs):
    if created:
        mensaje = f"Tienes una nueva cita agendada para el {instance.fecha_cita} a las {instance.hora_cita}."
        Notification.objects.create(usuario=instance.manicurista.usuario, mensaje=mensaje)