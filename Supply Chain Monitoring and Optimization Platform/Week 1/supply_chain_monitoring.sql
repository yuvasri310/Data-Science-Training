create database supplychain;
use supplychain;

create table suppliers(
supplier_id int primary key auto_increment,
name varchar(100),
contact varchar(100),
region varchar(50)
);

create table inventory(
item_id int primary key auto_increment,
item_name varchar(100),
stock_level int,
reorder_level int
);

create table orders(
order_id int primary key auto_increment,
supplier_id int,
item_id int,
quantity int,
order_date date,
delivery_date date,
foreign key(supplier_id) references suppliers(supplier_id),
foreign key(item_id) references inventory(item_id)
);


insert into suppliers(name,contact,region) values
('bharat logistics','bharat@logi.com','south'),
('express supply','express@supply.com','west'),
('united packers','united@pack.com','east'),
('nextgen scm','nextgen@scm.com','north'),
('omni freight','omni@freight.com','central');


insert into inventory(item_name,stock_level,reorder_level) values
('sensor module',120,50),
('copper wire',20,40),
('motor part',10,25),
('cooling fan',55,30),
('plastic casing',15,20),
('pcb board',35,35),
('resistor pack',75,40),
('led strip',10,30),
('battery unit',5,10),
('thermal paste',2,5);


insert into orders(supplier_id,item_id,quantity,order_date,delivery_date) values
(1,2,50,'2025-07-10','2025-07-13'),
(3,4,20,'2025-07-11','2025-07-14'),
(2,3,40,'2025-07-12','2025-07-15'),
(4,1,25,'2025-07-13','2025-07-16'),
(5,5,30,'2025-07-13','2025-07-18'),
(2,7,50,'2025-07-14','2025-07-17'),
(1,8,30,'2025-07-14','2025-07-19'),
(3,6,15,'2025-07-15','2025-07-20'),
(5,9,20,'2025-07-16','2025-07-21'),
(4,10,10,'2025-07-17','2025-07-22');

select*from orders;


update inventory set stock_level=stock_level-30 where item_id=2;


delete from orders where order_id=3;


insert into orders(supplier_id,item_id,quantity,order_date,delivery_date)
values(2,3,20,'2025-07-18','2025-07-23');

delimiter //

create procedure auto_reorder()
begin
declare done int default 0;
declare i_id int;
declare cur cursor for select item_id from inventory where stock_level<reorder_level;
declare continue handler for not found set done=1;

open cur;

read_loop:loop
fetch cur into i_id;
if done then
leave read_loop;
end if;
insert into orders(supplier_id,item_id,quantity,order_date,delivery_date)
values(1,i_id,50,curdate(),date_add(curdate(),interval 7 day));
end loop;

close cur;
end //

delimiter ;

