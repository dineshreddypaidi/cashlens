from django.http import JsonResponse,HttpResponse

from main import models as mainmodels
from django.forms.models import model_to_dict

import json

# from simpleorm.db import Connector
# from simpleorm.config import *

# mysqldb = Connector(load_from_json("api/config/mysql_db.json")).connect()

# maindata_table = mysqldb.use_table("main_maindata")

# transaction_table = mysqldb.use_table("main_transactions")


def txn_handler(response):
    main_data = mainmodels.MainData.objects.get(id=1)
    
    if response.transaction_type == "income":
        main_data.current_value += response.amount
        main_data.total_income += response.amount
        if response.category == "Loan":
            main_data.total_debt += response.amount
            
    if response.transaction_type == "expense":
        main_data.current_value -= response.amount
        if response.category == "Debt_Payments" and response.description != "intrest_paid":
            main_data.total_debt -= response.amount
        if response.category == "MyRule":
            main_data.contributed_one_perc += response.amount
        
    main_data.save()
    
    return True

def txn_add(request):
    if request.method == "POST":
        data = json.loads(request.body)
        response = mainmodels.Transactions.objects.create(**data)
        if txn_handler(response):
            print("everything worked")
        if response:
            return JsonResponse( {
                "message" : "record added succesful",
            },status=201)
        else:
            return JsonResponse({
            "error" : "something went wrong",
        },status = 400)
               
    else:
        return JsonResponse({
            "error" : "get method not allowed"
        },status = 401)

def mainview(request):
    if request.method == "GET":
        maindata, created = mainmodels.MainData.objects.get_or_create(
            id=1,
            defaults={
                "current_value": 0,
                "investments": 0,
                "total_debt": 0,
                "total_income": 0,
                "contributed_one_perc": 0,
            }
        )
        
        return JsonResponse({
            "maindata": model_to_dict(maindata),
            }, status=200)
    else:
        return HttpResponse("error")
    
def txnsrange(request,start_date,end_date):
    if request.method == "GET":
        try:  
            transactions = mainmodels.Transactions.objects.filter(date__range=[start_date, end_date]).order_by("-date","-id")
        except:
                return JsonResponse({
                "error" : "unknown error occured"
                },status = 401) 

        return JsonResponse({
            "transactions" : list(transactions.values())
        }, status=200)
    else:
        return JsonResponse({
            "error" : "post not allowed"
        },status = 401)