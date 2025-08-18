create database fitness;
use fitness;

create table exercises(exercise_id int primary key,
exercise_name varchar(50),category varchar(50),calories_burn_per_min int);

insert into exercises values(1,'Running','Cardio',10),
(2,'Cycling','Cardio',8),
(3,'Weight Lifting','Strength',6),
(4,'Yoga','Flexibility',4),
(5,'Swimming','Cardio',9),
(6,'Pilates','Flexibility',5);


create table workoutlog(log_id int primary key,exercise_id int,
date date,duration_min int,mood varchar(20),
foreign key(exercise_id) references exercises(exercise_id));

insert into workoutlog values
(101,1,'2025-03-01',30,'Energized'),
(102,1,'2025-03-05',45,'Tired'),
(103,2,'2025-03-02',20,'Normal'),
(104,2,'2025-03-10',25,'Energized'),
(105,3,'2025-03-03',40,'Tired'),
(106,3,'2025-04-01',30,'Normal'),
(107,4,'2025-03-04',60,'Normal'),
(108,4,'2025-04-02',50,'Energized'),
(109,5,'2025-03-06',35,'Tired'),
(110,5,'2025-03-12',40,'Energized');

-- 1. Show all exercises under the “Cardio” category.
select * from exercises where category="cardio";

-- 2. Show workouts done in the month of March 2025.
select * from workoutlog where date between '2025-03-01' and '2025-03-31';
select * from workoutlog where month(date)=3 and year(date)=2025;

-- 3. Calculate total calories burned per workout (duration × calories_burn_per_min).
select log_id,workoutlog.exercise_id,duration_min,duration_min*calories_burn_per_min as total_calories
from workoutlog join exercises on workoutlog.exercise_id=exercises.exercise_id;

-- 4. Calculate average workout duration per category.
select category,avg(duration_min) as avg_duration from workoutlog as w
join exercises e on w.exercise_id=e.exercise_id group by category;

-- 5. List exercise name, date, duration, and calories burned using a join.
select e.exercise_name,w.date,w.duration_min,w.duration_min*e.calories_burn_per_min 
as total_caloriesburnt from workoutlog w join exercises e on w.exercise_id =e.exercise_id;

-- 6. Show total calories burned per day.
select date,sum(duration_min*calories_burn_per_min) as total_caloriesburnt
from workoutlog w join exercises e on w.exercise_id=e.exercise_id group by date;

-- 7. Find the exercise that burned the most calories in total.
select e.exercise_name,sum(w.duration_min*e.calories_burn_per_min) as total_caloriesburnt
from workoutlog w join exercises e on w.exercise_id=e.exercise_id
group by e.exercise_name order by total_caloriesburnt desc limit 1;

-- 8. List exercises never logged in the workout log.
select * from exercises where exercise_id not in (select distinct exercise_id from workoutlog);

-- 9. Show workouts where mood was “Tired” and duration > 30 mins.
select * from workoutlog where mood="tired" and duration_min>30;

-- 10. Update a workout log to correct a wrongly entered mood.
update workoutlog set mood="energized" where log_id=105;

-- 11. Update the calories per minute for “Running”.
set sql_safe_updates=0;
update exercises set calories_burn_per_min=12 where exercise_name="running";

-- 12. Delete all logs from February 2024.
delete from workoutlog where month(date)=2 and year(date)=2024;
