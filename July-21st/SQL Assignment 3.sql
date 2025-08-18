use assignment;
create table books(book_id int primary key,title varchar(100),
author varchar(100),genre varchar(50),price decimal(10,2));

create table customers(customer_id int primary key,name varchar(100),
email varchar(100),city varchar(100));


create table orders(order_id int primary key,customer_id int,
book_id int,order_date date,quantity int ,
foreign key(customer_id) references customers(customer_id),
foreign key(book_id) references books(book_id));

insert into books(book_id,title,author,genre,price) values
(1,'ponniyin selvan','kalki krishnamurthy','historical',450.00),
(2,'sivagamiyin sabatham','kalki krishnamurthy','historical',500.00),
(3,'velpari','su venkatesan','fiction',600.00),
(4,'manimegalai','unknown','classic',300.00),
(5,'yaarukkaga azhuthen','jeyamohan','drama',550.00),
(6, 'clean code', 'C.Martin' ,'Program', 1200.00);


insert into customers(customer_id,name,email,city) values
(1,'yuvasri','yuva@example.com','namakkal'),
(2,'kavya','kavy310@example.com','hyderabad'),
(3,'theshitha','theshi@example.com','madurai'),
(4,'deepa','deepa@example.com','hyderabad'),
(5,'priya','priya123@example.com','coimbatore');

insert into orders(order_id,customer_id,book_id,order_date,quantity) values
(1,1,1,'2023-03-10',2),
(2,2,3,'2023-04-15',1),
(3,3,2,'2023-05-01',1),
(4,4,3,'2023-06-12',2),
(5,5,5,'2023-07-08',3),
(6,2,4,'2023-08-20',1),
(7,2,1,'2023-09-01',1);


-- 1. List all books with price above 500.
select * from books where price>500;

-- 2. Show all customers from the city of ‘Hyderabad’.
select * from customers where city='Hyderabad';

-- 3. Find all orders placed after ‘2023-01-01’.
select * from orders where order_date>'2023-01-01';

-- 4. Show customer names along with book titles they purchased.
select c.name,b.title from orders o join customers c on o.customer_id
=c.customer_id join books b on o.book_id=b.book_id;

-- 5. List each genre and total number of books sold in that genre.
select b.genre,count(o.order_id) as book_sold from books b join orders o
on b.book_id=o.book_id group by b.genre;

-- 6. Find the total sales amount (price × quantity) for each book.
select b.title,sum(b.price*o.quantity) as total_price from books b join orders o on b.book_id=o.book_id
group by b.title;

-- 7. Show the customer who placed the highest number of orders.
select c.*,count(o.order_id)as total from customers c join orders o 
on c.customer_id =o.customer_id group by c.customer_id,
c.name,c.email order by total desc limit 1;

-- 8. Display average price of books by genre.
select genre,avg(price) as avg_price from books group by genre;

-- 9. List all books that have not been ordered.
select * from books where book_id not in(select distinct book_id 
from orders);

-- 10. Show the name of the customer who has spent the most in total.
select c.name,sum(b.price*o.quantity) as total_spent from orders o join
customers c on o.customer_id=c.customer_id join books b on
o.book_id=b.book_id group by c.name order by total_spent desc limit 1;