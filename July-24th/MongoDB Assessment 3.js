use("jobportalDB");

db.createCollection("jobs");
db.createCollections("applicants");
db.createCollections("applications");

db.jobs.insertMany([
  {
    job_id: 1,
    title: "Data Engineer",
    company: "Hexaware",
    location: "Chennai",
    salary: 400000,
    job_type: "remote",
    posted_on: new Date("2025-07-01"),
  },
  {
    job_id: 2,
    title: "Data Analyst",
    company: "CTS",
    location: "Hyderabad",
    salary: 800000,
    job_type: "on-site",
    posted_on: new Date("2025-06-25"),
  },
  {
    job_id: 3,
    title: "DevOps Engineer",
    company: "Accenture",
    location: "Pune",
    salary: 1500000,
    job_type: "hybrid",
    posted_on: new Date("2025-06-15"),
  },
  {
    job_id: 4,
    title: "Backend Developer",
    company: "Zoho",
    location: "Madurai",
    salary: 950000,
    job_type: "remote",
    posted_on: new Date("2025-06-28"),
  },
  {
    job_id: 5,
    title: "Full Stack Developer",
    company: "LTI",
    location: "Bangalore",
    salary: 1400000,
    job_type: "on-site",
    posted_on: new Date("2025-06-05"),
  },
  {
    job_id: 6,
    title: "QA Engineer",
    company: "Honeybee",
    location: "Mumbai",
    salary: 900000,
    job_type: "remote",
    posted_on: new Date("2025-06-20"),
  },
]);

db.applicants.insertMany([
  {
    applicant_id: 101,
    name: "Yuvasri",
    skills: ["Java", "MongoDB", "Node.js"],
    experience: 3,
    city: "Bangalore",
    applied_on: new Date("2025-07-02"),
  },
  {
    applicant_id: 102,
    name: "kavya",
    skills: ["Python", "SQL", "Power BI"],
    experience: 2,
    city: "Hyderabad",
    applied_on: new Date("2025-07-03"),
  },
  {
    applicant_id: 103,
    name: "Theshitha",
    skills: ["C++", "MongoDB", "AWS"],
    experience: 4,
    city: "Pune",
    applied_on: new Date("2025-07-01"),
  },
  {
    applicant_id: 104,
    name: "Dhurga",
    skills: ["React", "Node.js", "MongoDB"],
    experience: 5,
    city: "Bangalore",
    applied_on: new Date("2025-06-28"),
  },
  {
    applicant_id: 105,
    name: "Preetha",
    skills: ["Java", "Docker", "Kubernetes"],
    experience: 1,
    city: "Chennai",
    applied_on: new Date("2025-06-27"),
  },
]);

db.applications.insertMany([
  {
    app_id: 1001,
    applicant_id: 101,
    job_id: 1,
    application_status: "interview scheduled",
    interview_scheduled: new Date("2025-07-10"),
    feedback: "",
  },
  {
    app_id: 1002,
    applicant_id: 102,
    job_id: 2,
    application_status: "applied",
    interview_scheduled: null,
    feedback: "",
  },
  {
    app_id: 1003,
    applicant_id: 103,
    job_id: 1,
    application_status: "interview scheduled",
    interview_scheduled: new Date("2025-07-12"),
    feedback: "",
  },
  {
    app_id: 1004,
    applicant_id: 101,
    job_id: 3,
    application_status: "applied",
    interview_scheduled: null,
    feedback: "",
  },
  {
    app_id: 1005,
    applicant_id: 104,
    job_id: 4,
    application_status: "applied",
    interview_scheduled: null,
    feedback: "",
  },
]);

// 1. Find all remote jobs with a salary greater than 10,00,000.
db.jobs.find({ job_type: "remote", salary: { $gt: 1000000 } });

// 2. Get all applicants who know MongoDB.
db.applicants.find({ skills: "MongoDB" });

// 3. Show the number of jobs posted in the last 30 days.
db.jobs.countDocuments({
  posted_on: { $gte: new Date(new Date() - 30 * 24 * 60 * 60 * 1000) },
});

// 4. List all job applications that are in ‘interview scheduled’ status.
db.applications.find({ application_status: "interview scheduled" });

// 5. Find companies that have posted more than 2 jobs.
db.jobs.aggregate([
  { $group: { _id: "$company", totalJobs: { $sum: 1 } } },
  { $match: { totalJobs: { $gt: 2 } } },
]);

// 6. Join applications with jobs to show job title along with the applicant’s name.
db.applications.aggregate([
  {
    $lookup: {
      from: "jobs",
      localField: "job_id",
      foreignField: "job_id",
      as: "job_info",
    },
  },
  { $unwind: "$job_info" },
  {
    $lookup: {
      from: "applicants",
      localField: "applicant_id",
      foreignField: "applicant_id",
      as: "applicant_info",
    },
  },
  { $unwind: "$applicant_info" },
  {
    $project: {
      job_title: "$job_info.title",
      applicant_name: "$applicant_info.name",
    },
  },
]);

// 7. Find how many applications each job has received.
db.applications.aggregate([
  { $group: { _id: "$job_id", totalApplications: { $sum: 1 } } },
]);

// 8. List applicants who have applied for more than one job.
db.applications.aggregate([
  { $group: { _id: "$applicant_id", totalJobs: { $sum: 1 } } },
  { $match: { totalJobs: { $gt: 1 } } },
  {
    $lookup: {
      from: "applicants",
      localField: "_id",
      foreignField: "applicant_id",
      as: "applicant_info",
    },
  },
  { $unwind: "$applicant_info" },
  { $project: { name: "$applicant_info.name", totalJobs: 1 } },
]);

// 9. Show the top 3 cities with the most applicants.
db.applicants.aggregate([
  { $group: { _id: "$city", count: { $sum: 1 } } },
  { $sort: { count: -1 } },
  { $limit: 3 },
]);

// 10. Get the average salary for each job type (remote, hybrid, on-site).
db.jobs.aggregate([
  { $group: { _id: "$job_type", avgSalary: { $avg: "$salary" } } },
]);

// 11. Update the status of one application to "offer made".
db.applications.updateOne(
  { app_id: 1002 },
  { $set: { application_status: "offer made" } }
);

// 12. Delete a job that has not received any applications.
db.jobs.deleteOne({
  job_id: { $nin: db.applications.distinct("job_id") },
});

// 13. Add a new field shortlisted to all applications and set it to false.
db.applications.updateMany({}, { $set: { shortlisted: false } });

// 14. Increment experience of all applicants from "Hyderabad" by 1 year.
db.applicants.updateMany({ city: "Hyderabad" }, { $inc: { experience: 1 } });

// 15. Remove all applicants who haven’t applied to any job.
db.applicants.deleteMany({
  applicant_id: { $nin: db.applications.distinct("applicant_id") },
});
