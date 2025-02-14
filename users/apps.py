# users/apps.py
from django.apps import AppConfig

class UsersConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'users'

    def ready(self):
        # Importa y registra las señales explícitamente
        from . import signals
        signals  # Evita la advertencia de Pylance