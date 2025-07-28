#Q1
def factorial(n):
    result=1
    for i in range(1,n+1):
        result*=i
    return result

n=int(input("Enter a number:"))
print(f"Factorial of {n} is {factorial(n)}")

#Q2
students=[("Aarav",80),("Sanya",65),("Meera",92),("Rohan",55)]
print("Students scoring above 75:")
for name,score in students:
    if score>75:
        print(name)
average=sum(score for _,score in students)/len(students)
print(f"Average score is {average}")

#Q3
class BankAccount:
    def __init__(self, holder_name, balance):
        self.holder_name = holder_name
        self.balance = balance

    def deposit(self, amount):
        self.balance += amount
        print(f"{amount} deposited. New balance: {self.balance}")

    def withdraw(self, amount):
        if amount > self.balance:
            raise ValueError("Insufficient balance")
        self.balance -= amount
        print(f"{amount} withdrawn. New balance: {self.balance}")

name = input("Enter account holder name: ")
balance = float(input("Enter initial balance: "))
account = BankAccount(name, balance)
account.deposit(float(input("Enter amount to deposit: ")))
try:
    account.withdraw(float(input("Enter amount to withdraw: ")))
except ValueError as e:
    print(e)

#Q4
class SavingsAccount(BankAccount):
    def __init__(self, holder_name, balance, interest_rate):
        super().__init__(holder_name, balance)
        self.interest_rate = interest_rate
    def apply_interest(self):
        interest = self.balance * (self.interest_rate / 100)
        self.balance += interest
        print(f"Interest of {interest} applied. New balance: {self.balance}")
name = input("Enter savings account holder name: ")
balance = float(input("Enter initial balance: "))
rate = float(input("Enter interest rate (%): "))
savings = SavingsAccount(name, balance, rate)
savings.deposit(float(input("Enter amount to deposit: ")))
try:
    savings.withdraw(float(input("Enter amount to withdraw: ")))
except ValueError as e:
    print(e)
savings.apply_interest()

#Q5
import pandas as pd
df = pd.read_csv("orders.csv")
df["CustomerName"] = df["CustomerName"].fillna("Unknown")
df["Quantity"] = df["Quantity"].fillna(0)
df["Price"] = df["Price"].fillna(0)
df["TotalAmount"] = df["Quantity"] * df["Price"]
df.to_csv("orders_cleaned.csv", index=False)

#Q6
import json
with open("inventory.json") as f:
    data=json.load(f)
for item in data:
    item["status"]="In Stock" if item["stock"]>0 else "Out of Stock"
with open("inventory_updated.json","w") as f:
    json.dump(data,f,indent=2)

#Q7
import numpy as np
import pandas as pd
scores=np.random.randint(35,101,20)
above_75=np.sum(scores>75)
mean=np.mean(scores)
std=np.std(scores)
print(f"Scores:{scores}")
print(f"Students scoring above 75:{above_75}")
print(f"Mean:{mean}, Standard Deviation:{std}")
df=pd.DataFrame({"Score":scores})
df.to_csv("scores.csv",index=False)




