from django.db import models
from django.apps import apps  # Importación diferida
from users.models import User
from manicurists.models import Manicurist  # Import Manicurist model

class Appointment(models.Model):
    client = models.ForeignKey(User, on_delete=models.CASCADE, related_name='appointments')
    manicurist = models.ForeignKey(Manicurist, on_delete=models.CASCADE, related_name='appointments')
    date = models.DateField()
    time = models.TimeField()

    def __str__(self):
        return f"{self.client.username} - {self.date} {self.time}"
