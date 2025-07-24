create database assessment;
use assessment;

create table destinations(destination_id int primary key,
city varchar(50),country varchar(50),category varchar(20),
avg_cost_per_day int);

create table trips(trip_id int primary key,destination_id int,
traveler_name varchar(50),start_date date,end_date date,budget int,
foreign key(destination_id) references destinations(destination_id));

insert into destinations values
(1,'pyramid','Egypt','Historical',3200),
(2,'TamilNadu','India','Historical',1800),
(3,'Paris','France','Historical',4000),
(4,'Bali','Indonesia','Beach',2700),
(5,'Zurich','Switzerland','Nature',5000),
(6,'Queenstown','New Zealand','Adventure',4500),
(7,'Goa','India','beach',2500);


insert into trips values
(101,1,'yuvasri','2025-01-10','2025-01-15',13000),
(102,2,'Ravi','2025-02-05','2025-02-12',15000),
(103,3,'Meera','2025-03-01','2025-03-05',18000),
(104,4,'yuvasri','2025-04-01','2025-04-10',28000),
(105,5,'Ravi','2022-12-20','2022-12-30',40000),
(106,6,'Kavya','2025-01-05','2025-01-08',17000),
(107,3,'yuvasri','2025-06-01','2025-06-06',22000),
(108,4,'Meera','2025-07-10','2025-07-15',15000),
(109,1,'Kavya','2025-08-01','2025-08-05',11000),
(110,2,'yuvasri','2025-09-01','2025-09-04',8000);

-- 1. Show all trips to destinations in “India”.
select * from trips where destination_id in(select destination_id from 
destinations where country="India");

-- 2. List all destinations with an average cost below 3000.
select * from destinations where avg_cost_per_day<3000;

-- 3. Calculate the number of days for each trip.
select trip_id,datediff(end_date,start_date)+1 as trip_duration from trips;

-- 4. List all trips that last more than 7 days.
select * from trips where datediff(end_date,start_date)+1>7;

-- 5. List traveler name, destination city, and total trip cost (duration × avg_cost_per_day).
select t.traveler_name,d.city,(datediff(t.end_date,t.start_date)+1)*d.avg_cost_per_day
as total_cost from trips t join destinations d on t.destination_id=d.destination_id;

-- 6. Find the total number of trips per country.
select d.country,count(*) as total_trips from trips t join destinations d
on t.destination_id=d.destination_id group by d.country;

-- 7. Show average budget per country.
select d.country,avg(t.budget) as avg_budget from trips t join 
destinations d on t.destination_id=d.destination_id group by d.country;

-- 8. Find which traveler has taken the most trips.
select traveler_name,count(*) as trip_count from trips group by traveler_name
order by trip_count desc limit 1;

-- 9. Show destinations that haven’t been visited yet.
select * from destinations where destination_id not in (select
distinct destination_id from trips);

-- 10. Find the trip with the highest cost per day.
select trip_id,traveler_name,budget/(datediff(end_date,start_date)+1) as cost_per_day
from trips order by cost_per_day desc limit 1;

-- 11. Update the budget for a trip that was extended by 3 days.
update trips set end_date = date_add(end_date, interval 3 day),
budget = budget + (3 * (select avg_cost_per_day from destinations
where destinations.destination_id = trips.destination_id)) where trip_id = 2;

-- 12. Delete all trips that were completed before Jan 1, 2023.
delete from trips where end_date<'2023-01-01';
