from django.db import models
from users.models import User
# Create your models here.

class Manicurist(models.Model):
    usuario = models.OneToOneField(User, on_delete=models.CASCADE, related_name='manicurist')
    descripcion = models.TextField(blank=True, null=True)
    horario_disponible = models.JSONField(blank=True, null=True)
    estado = models.CharField(max_length=10, choices=[('activo', 'Activo'), ('inactivo', 'Inactivo')], default='activo')

    def __str__(self):
        return self.usuario.username