from django.contrib import admin
from .models import Manicurist

# Register your models here.

class ManicuristAdmin(admin.ModelAdmin):
    model = Manicurist

admin.site.register(Manicurist, ManicuristAdmin)