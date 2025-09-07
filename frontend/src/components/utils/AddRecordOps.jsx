const EXPENSE_CATEGORIES = {
  Food: ["Tea","Fruits", "Snacks","Eggs", "Beverages","Dine-out/Restaurent",],
  Commute: ["Fuel", "Bus", "Taxi", "Train", "Metro"],
  Health : ["Pharmacy","Doctor-consultation","lab/reports","insurance"],
  Rent: ["Hostel", "Apartment", "Office", "Storage"],
  Education : ["Course",],
  Shopping : ["Clothes","Electronics"],
  Utilities: ["Recharge", "Electricity", "Water", "Internet", "Gas"],
  Entertainment: ["Movies", "Concerts", "Games", "Subscriptions"],
  Debt_Payments : ["credit_card","personal_loan","intrest_paid"],
  MyRule : ["Donated",], //
  My_circle : ["sent_to_parents","sent_to_friends","sent_to_relatives"],
  Other: ["Miscellaneous", "Unplanned"],
};

const INCOME_CATEGORIES = {
  Freelance: ["Bike_Taxi","Project Work", "Consulting",],
  Salary: ["Monthly Paycheck", "Bonus", "Overtime"],
  Interest: ["Savings Account", "Fixed Deposit", "Bonds"],
  Loan : ["personal_loan","credit_usage",],
  Gift: ["Cash Gift", "Voucher", "Prize"],
  Cashback : ["Cashback"],
  My_circle : ["Parents_sent","Friends_sent","relatives_sent"],
  Other: ["Miscellaneous", "Unexpected"]
};

export { EXPENSE_CATEGORIES, INCOME_CATEGORIES };
