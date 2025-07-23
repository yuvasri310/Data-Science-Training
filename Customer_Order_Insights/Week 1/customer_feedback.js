use("customer_feedback");

db.feedback.insertMany([
  {
    customer_id: 1,
    feedback: "No issues at all",
    date: new Date("2025-07-10"),
  },
  {
    customer_id: 2,
    feedback: "Product came late",
    date: new Date("2025-07-16"),
  },
  {
    customer_id: 3,
    feedback: "Great delivery service!",
    date: new Date("2025-07-20"),
  },
  {
    customer_id: 4,
    feedback: "Courier was polite but late",
    date: new Date("2025-07-18"),
  },
  {
    customer_id: 5,
    feedback: "Delay due to rain",
    date: new Date("2025-07-10"),
  },
  {
    customer_id: 6,
    feedback: "Quick and smooth delivery",
    date: new Date("2025-07-18"),
  },
  {
    customer_id: 7,
    feedback: "Great delivery service!",
    date: new Date("2025-07-11"),
  },
  {
    customer_id: 8,
    feedback: "Not happy with delivery time",
    date: new Date("2025-07-14"),
  },
  { customer_id: 9, feedback: "Very satisfied", date: new Date("2025-07-12") },
  {
    customer_id: 10,
    feedback: "Received wrong item",
    date: new Date("2025-07-19"),
  },
]);

db.feedback.createIndex({ customer_id: 1 });
