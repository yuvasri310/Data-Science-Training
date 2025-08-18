create database order_tracker;
use order_tracker;
create table customers (
    customer_id int primary key auto_increment,
    name varchar(100),
    email varchar(100),
    phone varchar(15),
    address text,
    region varchar(50)
);

insert into customers (name, email, phone, address, region) values
('yuvasri', 'yuvasri@mail.com', '9999999999', '648 street, coimbatore', 'coimbatore'),
('ravi', 'ravi@mail.com', '8888888888', '971 street, bangalore', 'bangalore'),
('priya', 'priya@mail.com', '9777777777', '722 street, hyderabad', 'hyderabad'),
('arjun', 'arjun@mail.com', '7111111111', '819 street, mumbai', 'mumbai'),
('divya', 'divya@mail.com', '9666666666', '363 street, chennai', 'chennai'),
('naveen', 'naveen@mail.com', '9555555555', '157 street, coimbatore', 'coimbatore'),
('sneha', 'sneha@mail.com', '7666666666', '220 street, bangalore', 'bangalore'),
('vikram', 'vikram@mail.com', '9000003333', '331 street, hyderabad', 'hyderabad'),
('aisha', 'aisha@mail.com', '9777444567', '426 street, mumbai', 'mumbai'),
('karthik', 'karthik@mail.com', '9999222333', '678 street, chennai', 'chennai');

create table orders (
    order_id int primary key auto_increment,
    customer_id int,
    order_date date,
    delivery_date date,
    status varchar(50),
    foreign key (customer_id) references customers(customer_id)
);

insert into orders (customer_id, order_date, delivery_date, status) values
(5, '2025-07-14', '2025-07-19', 'delayed'),
(8, '2025-07-14', '2025-07-22', 'delayed'),
(10, '2025-07-10', '2025-07-18', 'delayed'),
(6, '2025-07-08', '2025-07-13', 'delayed'),
(10, '2025-07-05', '2025-07-10', 'delayed'),
(8, '2025-07-04', '2025-07-07', 'delivered'),
(6, '2025-07-10', '2025-07-18', 'delayed'),
(10, '2025-07-14', '2025-07-21', 'delayed'),
(1, '2025-07-08', '2025-07-15', 'delayed'),
(10, '2025-07-13', '2025-07-19', 'delayed'),
(5, '2025-07-01', '2025-07-04', 'delivered'),
(10, '2025-07-08', '2025-07-15', 'delayed'),
(9, '2025-07-05', '2025-07-12', 'delayed'),
(4, '2025-07-01', '2025-07-08', 'delayed'),
(4, '2025-07-01', '2025-07-07', 'delayed'),
(8, '2025-07-04', '2025-07-11', 'delayed'),
(10, '2025-07-09', '2025-07-15', 'delayed'),
(1, '2025-07-10', '2025-07-16', 'delayed'),
(4, '2025-07-03', '2025-07-10', 'delayed'),
(2, '2025-07-13', '2025-07-17', 'delayed');

create table delivery_status (
    status_id int primary key auto_increment,
    order_id int,
    status_description varchar(100),
    delay_days int,
    foreign key (order_id) references orders(order_id)
);

insert into delivery_status (order_id, status_description, delay_days) values
(1, 'heavy rain', 1),
(2, 'heavy rain', 3),
(3, 'heavy rain', 5),
(4, 'heavy rain', 1),
(5, 'product misplaced', 1),
(6, 'delivery boy absent', 5),
(7, 'on time', 0),
(8, 'courier issue', 2),
(9, 'on time', 0),
(10, 'wrong address', 1),
(11, 'product misplaced', 2),
(12, 'delivery boy absent', 3),
(13, 'on time', 0),
(14, 'heavy rain', 5),
(15, 'traffic jam', 2),
(16, 'wrong address', 4),
(17, 'on time', 0),
(18, 'traffic jam', 3),
(19, 'heavy rain', 4),
(20, 'on time', 0);


-- update
UPDATE orders SET status = 'Delivered' WHERE order_id = 3;

-- delete
DELETE FROM orders WHERE order_id = 5;

-- show orders delivers on time
SELECT o.order_id, o.delivery_date FROM orders o JOIN delivery_status ds ON o.order_id = ds.order_id
WHERE ds.delay_days = 0;

delimiter $$
create procedure getdelayeddeliveries(in cust_id int)
begin
    select o.order_id, o.delivery_date, ds.status_description, ds.delay_days
    from orders o
    join delivery_status ds on o.order_id = ds.order_id
    where o.customer_id = cust_id and ds.delay_days > 0;
end$$
delimiter ;


