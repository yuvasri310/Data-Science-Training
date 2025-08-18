use("fitnesscenterDB");

db.createCollection("members");
db.createCollection("trainers");
db.createCollection("sessions");

db.members.insertMany([
  {
    member_id: 1,
    name: "anjali rao",
    age: 28,
    gender: "female",
    city: "mumbai",
    membership_type: "gold",
  },
  {
    member_id: 2,
    name: "rohan mehta",
    age: 35,
    gender: "male",
    city: "delhi",
    membership_type: "silver",
  },
  {
    member_id: 3,
    name: "fatima shaikh",
    age: 22,
    gender: "female",
    city: "hyderabad",
    membership_type: "platinum",
  },
  {
    member_id: 4,
    name: "vikram das",
    age: 41,
    gender: "male",
    city: "bangalore",
    membership_type: "gold",
  },
  {
    member_id: 5,
    name: "neha kapoor",
    age: 31,
    gender: "female",
    city: "pune",
    membership_type: "silver",
  },
]);

db.trainers.insertMany([
  {
    trainer_id: 101,
    name: "ajay kumar",
    specialty: "weight training",
    experience: 7,
  },
  { trainer_id: 102, name: "swati nair", specialty: "cardio", experience: 5 },
  { trainer_id: 103, name: "imran qureshi", specialty: "yoga", experience: 8 },
]);

db.sessions.insertMany([
  {
    session_id: 201,
    member_id: 1,
    trainer_id: 101,
    session_type: "strength",
    duration: 60,
    date: new Date("2024-08-01"),
  },
  {
    session_id: 202,
    member_id: 2,
    trainer_id: 102,
    session_type: "cardio",
    duration: 45,
    date: new Date("2024-08-02"),
  },
  {
    session_id: 203,
    member_id: 3,
    trainer_id: 103,
    session_type: "yoga",
    duration: 90,
    date: new Date("2024-08-03"),
  },
  {
    session_id: 204,
    member_id: 1,
    trainer_id: 102,
    session_type: "cardio",
    duration: 30,
    date: new Date("2024-08-04"),
  },
  {
    session_id: 205,
    member_id: 4,
    trainer_id: 101,
    session_type: "strength",
    duration: 75,
    date: new Date("2024-08-05"),
  },
  {
    session_id: 206,
    member_id: 5,
    trainer_id: 103,
    session_type: "yoga",
    duration: 60,
    date: new Date("2024-08-05"),
  },
]);

//1. Find all members from Mumbai.
db.members.find({ city: "mumbai" });

//2. List all trainers with experience greater than 6 years.
db.trainers.find({ experience: { $gt: 6 } });

//3. Get all Yoga sessions.
db.sessions.find({ session_type: "yoga" });

//4. Show all sessions conducted by trainer Swati Nair.
trainer = db.trainers.findOne({ name: "swati nair" }).trainer_id;
db.sessions.find({ trainer_id: trainer });

//5. Find all members who attended a session on 2024-08-05.
db.sessions.find({ date: new Date("2024-08-05") });

//6. Count the number of sessions each member has attended.
db.sessions.aggregate([{ $group: { _id: "$member_id", count: { $sum: 1 } } }]);

//7. Show average duration of sessions for each session_type.
db.sessions.aggregate([
  { $group: { _id: "$session_type", avg_duration: { $avg: "$duration" } } },
]);

//8. Find all female members who attended a session longer than 60 minutes.
db.sessions.aggregate([
  { $match: { duration: { $gt: 60 } } },
  {
    $lookup: {
      from: "members",
      localField: "member_id",
      foreignField: "member_id",
      as: "member",
    },
  },
  { $unwind: "$member" },
  { $match: { "member.gender": "female" } },
]);

//9. Display sessions sorted by duration (descending).
db.sessions.find().sort({ duration: -1 });

//10. Find members who have attended sessions with more than one trainer.
db.sessions.aggregate([
  {
    $group: {
      _id: "$member_id",
      unique_trainers: { $addToSet: "$trainer_id" },
    },
  },
  { $project: { _id: 1, count: { $size: "$unique_trainers" } } },
  { $match: { count: { $gt: 1 } } },
]);

// 11. Use $lookup to display sessions with member name and trainer name.
db.sessions.aggregate([
  {
    $lookup: {
      from: "members",
      localField: "member_id",
      foreignField: "member_id",
      as: "member",
    },
  },
  {
    $lookup: {
      from: "trainers",
      localField: "trainer_id",
      foreignField: "trainer_id",
      as: "trainer",
    },
  },
  { $unwind: "$member" },
  { $unwind: "$trainer" },
  {
    $project: {
      _id: 0,
      session_id: 1,
      session_type: 1,
      duration: 1,
      "member.name": 1,
      "trainer.name": 1,
    },
  },
]);

// 12. Calculate total session time per trainer.
db.sessions.aggregate([
  { $group: { _id: "$trainer_id", total_duration: { $sum: "$duration" } } },
]);

// 13. List each member and their total time spent in the gym.
db.sessions.aggregate([
  { $group: { _id: "$member_id", total_duration: { $sum: "$duration" } } },
]);

// 14. Count how many sessions each trainer has conducted.
db.sessions.aggregate([
  { $group: { _id: "$trainer_id", session_count: { $sum: 1 } } },
]);

// 15. Find which trainer has conducted the longest average session duration.
db.sessions.aggregate([
  { $group: { _id: "$trainer_id", avg_duration: { $avg: "$duration" } } },
  { $sort: { avg_duration: -1 } },
  { $limit: 1 },
]);

// 16. Show how many unique members each trainer has trained.
db.sessions.aggregate([
  {
    $group: { _id: "$trainer_id", unique_members: { $addToSet: "$member_id" } },
  },
  { $project: { count: { $size: "$unique_members" } } },
]);

// 17. Find the most active member (by total session duration).
db.sessions.aggregate([
  { $group: { _id: "$member_id", total: { $sum: "$duration" } } },
  { $sort: { total: -1 } },
  { $limit: 1 },
]);

// 18. List all Gold membership members who took at least one Strength session.
db.sessions.aggregate([
  { $match: { session_type: "strength" } },
  {
    $lookup: {
      from: "members",
      localField: "member_id",
      foreignField: "member_id",
      as: "member",
    },
  },
  { $unwind: "$member" },
  { $match: { "member.membership_type": "gold" } },
  { $project: { "member.name": 1 } },
]);

// 19. Display a breakdown of sessions by membership type.
db.sessions.aggregate([
  {
    $lookup: {
      from: "members",
      localField: "member_id",
      foreignField: "member_id",
      as: "member",
    },
  },
  { $unwind: "$member" },
  { $group: { _id: "$member.membership_type", count: { $sum: 1 } } },
]);

// 20. Find members who have not attended any session yet (hint: simulate later by adding a new member).
db.members.aggregate([
  {
    $lookup: {
      from: "sessions",
      localField: "member_id",
      foreignField: "member_id",
      as: "session",
    },
  },
  { $match: { session: { $eq: [] } } },
]);
