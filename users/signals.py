# users/signals.py
from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import User
from manicurists.models import Manicurist
from clients.models import Client

@receiver(post_save, sender=User)
def create_or_update_user_profile(sender, instance, **kwargs):
    # Verifica si el usuario ya tiene un perfil de Manicurist o Client
    if instance.rol == 'manicurista':
        # Si el usuario ya tiene un perfil de Client, lo elimina
        if hasattr(instance, 'client'):
            instance.client.delete()
        # Crea o actualiza el perfil de Manicurist
        Manicurist.objects.get_or_create(usuario=instance)
    elif instance.rol == 'cliente':
        # Si el usuario ya tiene un perfil de Manicurist, lo elimina
        if hasattr(instance, 'manicurist'):
            instance.manicurist.delete()
        # Crea o actualiza el perfil de Client
        Client.objects.get_or_create(usuario=instance)
    else:
        # Si el rol no es ni 'manicurista' ni 'cliente', elimina cualquier perfil existente
        if hasattr(instance, 'manicurist'):
            instance.manicurist.delete()
        if hasattr(instance, 'client'):
            instance.client.delete()