# Q1. Write a function is_prime(n) that returns True if n is a prime number, else False 
def is_prime(n):
    if n==2:
        return True
    elif n<=1:
        return False
    for i in range(2,int(n**0.5)+1):
        if n%i==0:
            return False
    return True

n=int(input("Enter a number:"))
if is_prime(n):
    print(f"{n} is prime")
else:
    print(f"{n} is not prime")


#Q2 
def palindrome():
    s=input("enter a string:")
    reverse=s[::-1]
    print("reversed:",reverse)
    if s==reverse:
        print("palindrome")
    else:
        print("not a palindrome")

#Q3
nums=list(map(int,input("Enter numbers:").split()))
unique=sorted(set(nums))
print("Unique sorted numbers:",unique)
if len(unique)>=2:
    print(f"Second largest number is {unique[-2]}")
else:
    print("Not enough unique values")


#Q4
class Person:
    def __init__(self,name,age):
        self.name=name
        self.age=age

    def display(self):
        print(f"Name:{self.name}, Age:{self.age}")

class Employee(Person):
    def __init__(self,name,age,employee_id,department):
        super().__init__(name,age)
        self.employee_id=employee_id
        self.department=department

    def display(self):
        super().display()
        print(f"Employee ID:{self.employee_id}, Department:{self.department}")

name=input("Enter employee name:")
age=int(input("Enter age:"))
eid=input("Enter employee ID:")
dept=input("Enter department:")
emp=Employee(name,age,eid,dept)
emp.display()

#Q5
class Vehicle:
    def drive(self):
        print("vehicle is driving")

class Car(Vehicle):
    def drive(self):
        print("car is zooming on the road")

v=Vehicle()
c=Car()
v.drive()
c.drive()

#Q6
import pandas as pd
df=pd.read_csv("students.csv")
avg_age=df['Age'].astype(float).mean()
df['Age'].fillna(round(avg_age),inplace=True)
df['Score'].fillna(0,inplace=True)
print(df)
df.to_csv("students_cleaned.csv",index=False)
print("students_cleaned.csv saved")

#Q7
import pandas as pd
df=pd.read_csv("students_cleaned.csv")
df.to_json("students.json",orient="records",indent=4)
print("students.json saved")

#Q8
import pandas as pd
df=pd.read_csv("students_cleaned.csv")
def get_status(score):
    if score>=85:
        return "Excellent"
    elif score>=60:
        return "Passed"
    else:
        return "Failed"
df['Status']=df['Score'].apply(get_status)
df['Tax_ID']=df['ID'].apply(lambda x:f"TAX-{x}")
df.to_csv("students_transformed.csv",index=False)
print("students_transformed.csv saved")

#Q9
import json
with open("products.json","r") as f:
    products=json.load(f)
for p in products:
    old=p['price']
    p['price']=round(old*1.10,2)
    print(f"{p['name']} price updated: {old} → {p['price']}")
with open("products_updated.json","w") as f:
    json.dump(products,f,indent=4)
print("products_updated.json saved")






