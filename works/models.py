from django.db import models
from manicurists.models import Manicurist

class Work(models.Model):
    manicurista = models.ForeignKey(Manicurist, on_delete=models.CASCADE, related_name='works')
    imagen = models.ImageField(upload_to='works/', blank=True, null=True)  # Nuevo campo
    descripcion = models.TextField(blank=True, null=True)
    fecha_subida = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Trabajo de {self.manicurista.usuario.username}"