from django.db import models
from users.models import User

# Create your models here.
class Client(models.Model):
    usuario = models.OneToOneField(User, on_delete=models.CASCADE, related_name='client')
    direccion = models.CharField(max_length=200, blank=True, null=True)
    preferencias = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.usuario.username