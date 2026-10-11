from django.http import JsonResponse,HttpResponse

from main import models as mainmodels
from django.forms.models import model_to_dict

import json
import os
import time
import urllib.request
import urllib.error

from django.views.decorators.csrf import ensure_csrf_cookie

def txn_handler(response):
    main_data = mainmodels.MainData.objects.get(id=1)
    
    if response.transaction_type == "income": 
        main_data.current_value += response.amount
        main_data.total_income += response.amount
        if response.category == "Loan":
            main_data.total_debt += response.amount
        if response.category == "Investment_withdraw":
            main_data.investments -= response.amount
            
    if response.transaction_type == "expense":
        main_data.current_value -= response.amount
        if response.category == "Debt_Payments" and response.description != "intrest_paid":
            main_data.total_debt -= response.amount
        if response.category == "MyRule":
            main_data.contributed_one_perc += response.amount
        if response.category == "Investments":
            main_data.investments += response.amount
            
        
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

@ensure_csrf_cookie
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


# --- exchange rate proxy -------------------------------------------------
# The API key stays server side. Cached in-process so a page load does not
# hit the upstream every time.
FALLBACK_USDINR = 87.63
RATE_TTL_SECONDS = 6 * 60 * 60

_rate_cache = {"rate": None, "fetched_at": 0.0}


def _fetch_usdinr():
    api_key = os.environ.get("EXCHANGE_RATE_API_KEY")
    if not api_key:
        return None

    url = "https://v6.exchangerate-api.com/v6/%s/pair/USD/INR" % api_key
    try:
        with urllib.request.urlopen(url, timeout=8) as resp:
            payload = json.loads(resp.read().decode("utf-8"))
    except (urllib.error.URLError, ValueError, TimeoutError) as err:
        print("exchange rate fetch failed:", err)
        return None

    rate = payload.get("conversion_rate")
    try:
        rate = float(rate)
    except (TypeError, ValueError):
        return None

    return rate if rate > 0 else None


def exchange_rate(request):
    if request.method != "GET":
        return JsonResponse({"error": "only get allowed"}, status=405)

    now = time.time()
    fresh = (
        _rate_cache["rate"] is not None
        and (now - _rate_cache["fetched_at"]) < RATE_TTL_SECONDS
    )

    if not fresh:
        rate = _fetch_usdinr()
        if rate is not None:
            _rate_cache["rate"] = rate
            _rate_cache["fetched_at"] = now

    rate = _rate_cache["rate"]
    return JsonResponse(
        {
            "conversion_rate": rate if rate is not None else FALLBACK_USDINR,
            "base": "USD",
            "target": "INR",
            "fallback": rate is None,
        },
        status=200,
    )
