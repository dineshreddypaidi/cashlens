from django.db import models

# Create your models here.
class MainData(models.Model):
    id = models.AutoField(primary_key=True)
    current_value = models.IntegerField(default=0)
    investments = models.PositiveBigIntegerField(default=0)
    total_debt = models.IntegerField(default=0)
    
    total_income = models.IntegerField(default=0)
    contributed_one_perc = models.IntegerField(default=0)
    
class Transactions(models.Model):
    TYPE = [
        ('expense', 'expense'),
        ('income','income'),
    ]
    id = models.AutoField(primary_key=True)
    date = models.DateField()
    category = models.CharField(max_length=100) # commute, food, others
    description = models.CharField(max_length=100) #type of expense or income from like freenlance etc for salary and tea etc for food type expense 
    note = models.TextField(null=True,blank=True) # if want to add something for the transaction
    amount = models.IntegerField()
    transaction_type = models.CharField(max_length=20,choices=TYPE)
    
    def __str__(self):
        return f'transaction_type : {self.transaction_type} - {self.amount}'