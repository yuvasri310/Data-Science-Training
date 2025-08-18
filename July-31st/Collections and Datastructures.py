#Section 1: Nested Lists & Access
students = [
    ["Ravi", [85, 72, 90]],
    ["Sneha", [95, 88, 92]],
    ["Kabir", [65, 70, 60]],
    ["Anita", [75, 80, 78]]
]

# 1. Ravi's second mark
print("Ravi's second mark:", students[0][1][1])

# 2. Average for each student
for name, marks in students:
    avg = sum(marks) / len(marks)
    print(f"{name}'s average: {avg:.2f}")

# 3. Students with all marks > 80
print("Students with all marks above 80:")
for name, marks in students:
    if all(m > 80 for m in marks):
        print(name)

# 4. New list: [name, average]
avg_list = [[name, sum(marks)/len(marks)] for name, marks in students]
print("List of name and average:", avg_list)

#Section 2: Dictionary of Lists
data = {
    "products": ["Mobile", "Laptop", "Tablet", "Camera"],
    "prices": [12000, 55000, 18000, 25000],
    "ratings": [4.5, 4.7, 4.0, 4.2]
}

# 1. List of dictionaries
product_list = [
    {"name": name, "price": price, "rating": rating}
    for name, price, rating in zip(data["products"], data["prices"], data["ratings"])
]
print("Product dictionaries:", product_list)

# 2. Filter: price > 20000 and rating >= 4.5
filtered = [p for p in product_list if p['price'] > 20000 and p['rating'] >= 4.5]
print("Filtered products:", filtered)

# 3. Sort by rating (descending)
sorted_products = sorted(product_list, key=lambda x: x['rating'], reverse=True)
print("Products sorted by rating:", sorted_products)

#Section 3: Frequency Dictionary + Set Operations
text = "ai is the future and ai will change everything in the ai world"

# 1. Frequency dictionary
words = text.split()
freq = {}
for word in words:
    freq[word] = freq.get(word, 0) + 1
print("Word frequencies:", freq)

# 2. Words that appear more than once
repeats = [word for word, count in freq.items() if count > 1]
print("Words appearing more than once:", repeats)

# 3. Sorted unique words
unique_words = sorted(set(words))
print("Sorted unique words:", unique_words)

# 4. Common words between sets
set1 = set(words)
set2 = {"ai", "ml", "data", "future"}
common = set1 & set2
print("Common words:", common)

#Section 4: Dictionary Comprehension + Conditional Logic
sales = {
    'Amit': 70000,
    'Sneha': 45000,
    'Ravi': 30000,
    'Anita': 90000,
    'Kabir': 20000
}

# 1. 10% bonus added
bonus_sales = {name: amt + amt * 0.1 for name, amt in sales.items()}
print("Sales with 10% bonus:", bonus_sales)

# 2. Sales > 50000
high_sales = {name: amt for name, amt in sales.items() if amt > 50000}
print("Sales > 50k:", high_sales)

# 3. Label: High / Medium / Low
labeled = {
    name: ("High" if amt >= 75000 else "Medium" if amt >= 40000 else "Low")
    for name, amt in sales.items()
}
print("Sales categories:", labeled)

#Section 5: Tuples, Sets, and Zipping
names = ("Ravi", "Sneha", "Kabir")
marks = (88, 92, 76)

# 1. Zip to dictionary
student_dict = dict(zip(names, marks))
print("Student dictionary:", student_dict)

# 2. Min and max
print("Min mark:", min(marks))
print("Max mark:", max(marks))

# 3. Create set and add new mark
mark_set = set(marks)
mark_set.add(85)
print("Updated mark set:", mark_set)

# 4. Merge two sets
set1 = {88, 76, 70}
set2 = {85, 90, 76}
merged = set1.union(set2)
print("Merged unique set:", merged)

# Bonus Challenge: Employee Dictionary
employees = {
    "E101": {"name": "Ravi", "dept": "Sales", "salary": 50000},
    "E102": {"name": "Sneha", "dept": "Engineering", "salary": 80000},
    "E103": {"name": "Kabir", "dept": "HR", "salary": 45000}
}

# 1. Add new employee
employees["E104"] = {"name": "Anita", "dept": "Engineering", "salary": 90000}

# 2. Increase salary by 10% for Engineering
for emp in employees.values():
    if emp["dept"] == "Engineering":
        emp["salary"] *= 1.10

# 3. Find dept with highest avg salary
from collections import defaultdict

dept_salaries = defaultdict(list)
for emp in employees.values():
    dept_salaries[emp["dept"]].append(emp["salary"])

avg_salaries = {dept: sum(sals)/len(sals) for dept, sals in dept_salaries.items()}
highest_dept = max(avg_salaries, key=avg_salaries.get)

print("Employees:", employees)
print("Department with highest avg salary:", highest_dept)
