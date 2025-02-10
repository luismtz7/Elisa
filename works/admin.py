from django.contrib import admin
from .models import Work

# Register your models here.

class WorkAdmin(admin.ModelAdmin):
    model = Work

admin.site.register(Work, WorkAdmin)