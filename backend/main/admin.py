from django.contrib import admin
from . import models

class Admin(admin.ModelAdmin):
    def get_list_display(self, request):
        return [field.name for field in self.model._meta.fields]

# Register your models here.
admin.site.register(models.MainData,Admin)
admin.site.register(models.Transactions,Admin)