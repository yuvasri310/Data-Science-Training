# 1. FizzBuzz Challenge
for i in range(1,51):
    if i%3==0 and i%5==0:
        print("FizzBuzz")
    elif i%3==0:
        print("Fizz")
    elif i%5==0:
        print("Buzz")
    else:
        print(i)

# 2. Login Simulation
crt_name="admin"
crt_pass="1234"
for i in range(3):
    username=input("enter username: ")
    password=input("enter password: ")
    if username==crt_name and crt_pass and password==crt_pass:
        print("login successfull")
        break
    else:
        print("username or password is wrong")
else:
    print("account locked")

# 3. Palindrome Checker
word=input("enter a word")
if word==word[::-1]:
    print("palindrome")
else:
    print("not a palindrome")

# 4. Prime Numbers in a Range
n=int(input("Enter a number: "))
print("Prime numbers:")
for num in range(2,n+1):
    for i in range(2,int(num**0.5)+1):
        if num%i==0:
            break
    else:
        print(num, end=" ")

#5. Star Pyramid
n=int(input("enter no of rows: "))
for i in range(1,n+1):
    print("*"*i)

# 6. Sum of Digits
num=input("enter a number: ")
total=sum(int(digit) for digit in num)
print("+".join(num),"=",total)

# 7. Multiplication Table Generator
num=int(input("Enter a number: "))
for i in range(1, 11):
    print(f"{num}x{i}={num*i}")

# 8. Count Vowels in a String
string=input("enter a string").lower()
vowels="aeiou"
count=sum(1 for char in string if char in vowels)
print("no of vowels:",count)



