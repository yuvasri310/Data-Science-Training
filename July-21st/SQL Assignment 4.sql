create database assignments;
use assignments;

 create table movies(movie_id int primary key,title varchar(100),
genre varchar(50),release_year int,rental_rate decimal(5,2));

create table customers(customer_id int primary key,name varchar(100),
email varchar(100),city varchar(50));

create table rentals(rental_id int primary key,customer_id int,
movie_id int,rental_date date,return_date date,
foreign key(customer_id) references customers(customer_id),
foreign key(movie_id) references movies(movie_id));

insert into movies(movie_id,title,genre,release_year,rental_rate) values
(1,'pariyerum perumal','drama',2018,70),
(2,'vikram','action',2022,90),
(3,'96','romance',2018,60),
(4,'kathi','sentimet',2019,80),
(5,'nandha','crime',2001,50);
 
insert into customers values(1,'yuvasri','yuva@gmail.com','namakkal');
insert into customers values(2,'vanitha','vani56@gmail.com','salem');
insert into customers values(3,'theshitha','theshii12@gmail.com','coimbatore');
insert into customers values(4,'kavya','kavya@gmail.com','karur');
insert into customers values(5,'Amit Sharma','amit@gmail.com','Bangalore');
insert into customers values (6, 'ram', 'ram@example.com', 'Chennai');

insert into rentals values(1,1,1,'2025-07-01','2025-07-05');
insert into rentals values(2,1,3,'2025-07-03','2025-07-08');
insert into rentals values(3,2,2,'2025-07-04','2025-07-06');
insert into rentals values(4,3,1,'2025-07-05','2025-07-07');
insert into rentals values(5,4,4,'2025-07-06','2025-07-10');
insert into rentals values(6,5,3,'2025-07-07','2025-07-09');
insert into rentals values(7,2,5,'2025-07-08','2025-07-12');
insert into rentals values(8,1,5,'2025-07-10',null);

-- 1. Retrieve all movies rented by a customer named 'Amit Sharma'.
select m.title from  movies m join rentals r on m.movie_id=r.movie_id
join customers c on r.customer_id=c.customer_id where c.name='Amit Sharma';

-- 2. Show the details of customers from 'Bangalore'.
select * from customers where city="Bangalore";

-- 3. List all movies released after the year 2020.
select title from movies where release_year>2020;

-- 4. Count how many movies each customer has rented.
select c.name,count(r.rental_id) as total from customers c 
join rentals r on c.customer_id=r.customer_id group by c.name;

-- 5. Find the most rented movie title.
select m.title ,count(r.rental_id) as total from movies m join 
rentals r on m.movie_id=r.movie_id group by m.title
order by total desc limit 1;

-- 6. Calculate total revenue earned from all rentals.
select sum(m.rental_rate) as total_revenue from rentals r join
movies m on r.movie_id=m.movie_id;

-- 7. List all customers who have never rented a movie.
select c.name from customers c left join rentals r on c.customer_id=
r.customer_id where r.rental_id is null;

-- 8. Show each genre and the total revenue from that genre.
select m.genre,sum(m.rental_rate) as total_revenue from movies m
join rentals r on m.movie_id=r.movie_id group by m.genre;

-- 9. Find the customer who spent the most money on rentals.
select c.name,sum(m.rental_rate) as money_spent from customers c
join rentals r on c.customer_id=r.customer_id join movies m on 
m.movie_id=r.movie_id group by c.name order by money_spent desc limit 1;

-- 10. Display movie titles that were rented and not yet returned ( return_date ISNULL ).
select m.title from movies m join rentals r on m.movie_id=r.movie_id
where r.return_date is null;





