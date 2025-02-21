# Generated by Django 5.1.5 on 2025-02-06 22:49

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('clients', '0001_initial'),
        ('manicurists', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Appointment',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('fecha_cita', models.DateField()),
                ('hora_cita', models.TimeField()),
                ('estado', models.CharField(choices=[('pendiente', 'Pendiente'), ('confirmada', 'Confirmada'), ('cancelada', 'Cancelada')], default='pendiente', max_length=10)),
                ('notas', models.TextField(blank=True, null=True)),
                ('cliente', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='appointments', to='clients.client')),
                ('manicurista', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='appointments', to='manicurists.manicurist')),
            ],
            options={
                'unique_together': {('manicurista', 'fecha_cita', 'hora_cita')},
            },
        ),
    ]
