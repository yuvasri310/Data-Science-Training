#1. BMI Calculator
import math
def calculate_bmi(weight, height):
    bmi = weight / math.pow(height, 2)
    return bmi
weight = float(input("Enter your weight (kg): "))
height = float(input("Enter your height (m): "))
bmi = calculate_bmi(weight, height)
print(f"Your BMI is: {bmi:.2f}")
if bmi < 18.5:
    print("You are Underweight")
elif 18.5 <= bmi <= 24.9:
    print("You are Normal")
else:
    print("You are Overweight")

# 2. Strong Password Checker
def is_strong(password):
    has_upper = any(c.isupper() for c in password)
    has_digit = any(c.isdigit() for c in password)
    has_special = any(c in "!@#$%^&*()_+" for c in password)
    return has_upper and has_digit and has_special

while True:
    pwd = input("Enter a strong password: ")
    if is_strong(pwd):
        print("Password is strong!")
        break
    else:
        print("Password must have 1 uppercase, 1 digit, and 1 special character (!@#$...). Try again.")

# 3. Weekly Expense Calculator
def expense_summary(expenses):
    total = sum(expenses)
    avg = total / len(expenses)
    high = max(expenses)
    print(f"Total spent: {total}")
    print(f"Average per day: {avg:.2f}")
    print(f"Highest spend in a day: {high}")

expenses = []
for i in range(1, 8):
    amount = float(input(f"Enter expense for day {i}: "))
    expenses.append(amount)

expense_summary(expenses)

# 4. Guess the Number
import random

secret = random.randint(1, 50)
attempts = 5

for i in range(attempts):
    guess = int(input(f"Attempt {i+1}/{attempts} - Guess the number (1-50): "))
    if guess == secret:
        print("Correct! You guessed the number.")
        break
    elif guess < secret:
        print("Too Low!")
    else:
        print("Too High!")
else:
    print(f"Sorry, you've used all attempts. The number was {secret}.")

# 5. Student Report Card
import datetime

def calculate_total(marks):
    return sum(marks)

def calculate_average(marks):
    return sum(marks) / len(marks)

def grade(average):
    if average >= 75:
        return "A"
    elif average >= 50:
        return "B"
    else:
        return "C"

name = input("Enter student name: ")
marks = [int(input(f"Enter marks for subject {i+1}: ")) for i in range(3)]

total = calculate_total(marks)
average = calculate_average(marks)
grade_result = grade(average)
date = datetime.date.today()

print("\n--- Student Report Card ---")
print(f"Name: {name}")
print(f"Marks: {marks}")
print(f"Total: {total}")
print(f"Average: {average:.2f}")
print(f"Grade: {grade_result}")
print(f"Date: {date}")

# 6. Contact Saver
contacts = {}

def add_contact():
    name = input("Enter name: ")
    phone = input("Enter phone number: ")
    contacts[name] = phone
    print("Contact added!")

def view_contacts():
    if not contacts:
        print("No contacts saved.")
    else:
        for name, phone in contacts.items():
            print(f"{name}: {phone}")

def save_to_file():
    with open("contacts.txt", "w") as file:
        for name, phone in contacts.items():
            file.write(f"{name}: {phone}\n")
    print("Contacts saved to contacts.txt")

while True:
    print("\n--- Contact Saver ---")
    print("1. Add Contact")
    print("2. View Contacts")
    print("3. Save & Exit")
    choice = input("Enter your choice: ")

    if choice == "1":
        add_contact()
    elif choice == "2":
        view_contacts()
    elif choice == "3":
        save_to_file()
        break
    else:
        print("Invalid choice. Try again.")
