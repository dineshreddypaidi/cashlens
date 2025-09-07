from django.urls import path
from . import views

urlpatterns = [
    path('main/',views.mainview),
    path("txns/<str:start_date>/<str:end_date>/", views.txnsrange, name="filtered"),
    path("txn/add/", views.txn_add,name="txn_adding.")
    
]
