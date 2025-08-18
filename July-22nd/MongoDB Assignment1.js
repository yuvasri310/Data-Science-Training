use("bookstoreDB");
db.createCollection("books");
db.createCollection("customers");
db.createCollection("orders");

db.books.insertMany([
  {
    book_id: 101,
    title: "ponniyin selvan",
    author: "Kalki",
    genre: "history",
    price: 650,
    stock: 18,
  },
  {
    book_id: 102,
    title: "parithi",
    author: "Venkatesan",
    genre: "history",
    price: 420,
    stock: 20,
  },
  {
    book_id: 103,
    title: "jayakanthan sirukathaigal",
    author: "Jayakanthan",
    genre: "logic",
    price: 380,
    stock: 16,
  },
  {
    book_id: 104,
    title: "clean code",
    author: "Robert c. Martin",
    genre: "technology",
    price: 999,
    stock: 12,
  },
  {
    book_id: 105,
    title: "wings of fire",
    author: "A.P.J Abdul kalam",
    genre: "biography",
    price: 299,
    stock: 25,
  },
]);

db.customers.insertMany([
  {
    customer_id: 201,
    name: "Yuvasri",
    email: "yuva@gmail.com",
    city: "Hyderabad",
  },
  {
    customer_id: 202,
    name: "kavya",
    email: "kavya@gmail.com",
    city: "Bangalore",
  },
  {
    customer_id: 203,
    name: "sneha",
    email: "sneha@gmail.com",
    city: "Hyderabad",
  },
  {
    customer_id: 204,
    name: "Priya",
    email: "priya@gmail.com",
    city: "Chennai",
  },
  {
    customer_id: 205,
    name: "theshitha",
    email: "theshi89@gmail.com",
    city: "Mumbai",
  },
]);

db.orders.insertMany([
  {
    order_id: 301,
    customer_id: 201,
    book_id: 101,
    order_date: ISODate("2023-02-15"),
    quantity: 1,
  },
  {
    order_id: 302,
    customer_id: 202,
    book_id: 104,
    order_date: ISODate("2023-03-10"),
    quantity: 2,
  },
  {
    order_id: 303,
    customer_id: 203,
    book_id: 102,
    order_date: ISODate("2022-12-20"),
    quantity: 1,
  },
  {
    order_id: 304,
    customer_id: 204,
    book_id: 103,
    order_date: ISODate("2023-05-05"),
    quantity: 3,
  },
  {
    order_id: 305,
    customer_id: 205,
    book_id: 105,
    order_date: ISODate("2023-01-10"),
    quantity: 2,
  },
  {
    order_id: 306,
    customer_id: 201,
    book_id: 104,
    order_date: ISODate("2023-06-18"),
    quantity: 1,
  },
  {
    order_id: 307,
    customer_id: 201,
    book_id: 103,
    order_date: ISODate("2024-01-01"),
    quantity: 2,
  },
]);

//1. List all books priced above 500.
db.books.find({ price: { $gt: 500 } });

//2. Show all customers from ‘Hyderabad’.
db.customers.find({ city: "Hyderabad" });

//3. Find all orders placed after January 1, 2023.
db.orders.find({ order_date: { $gt: ISODate("2023-01-01") } });

//4. Display order details with customer name and book title.
db.orders.aggregate([
  {
    $lookup: {
      from: "customers",
      localField: "customer_id",
      foreignField: "customer_id",
      as: "customer",
    },
  },
  { $unwind: "$customer" },
  {
    $lookup: {
      from: "books",
      localField: "book_id",
      foreignField: "book_id",
      as: "book",
    },
  },
  { $unwind: "$book" },
  {
    $project: {
      order_id: 1,
      order_date: 1,
      quantity: 1,
      "customer.name": 1,
      "book.title": 1,
    },
  },
]);

//5. Show total quantity ordered for each book.
db.orders.aggregate([
  {
    $group: {
      _id: "$book_id",
      total_quantity: { $sum: "$quantity" },
    },
  },
  {
    $lookup: {
      from: "books",
      localField: "_id",
      foreignField: "book_id",
      as: "book",
    },
  },
  { $unwind: "$book" },
  {
    $project: {
      _id: 0,
      book_title: "$book.title",
      total_quantity: 1,
    },
  },
]);

//6. Show the total number of orders placed by each customer.
db.orders.aggregate([
  {
    $group: {
      _id: "$customer_id",
      total_orders: { $sum: 1 },
    },
  },
  {
    $lookup: {
      from: "customers",
      localField: "_id",
      foreignField: "customer_id",
      as: "customer",
    },
  },
  { $unwind: "$customer" },
  {
    $project: {
      _id: 0,
      customer_name: "$customer.name",
      total_orders: 1,
    },
  },
]);

//7. Calculate total revenue generated per book.
db.orders.aggregate([
  {
    $lookup: {
      from: "books",
      localField: "book_id",
      foreignField: "book_id",
      as: "book",
    },
  },
  { $unwind: "$book" },
  {
    $group: {
      _id: "$book_id",
      total_revenue: { $sum: { $multiply: ["$quantity", "$book.price"] } },
      title: { $first: "$book.title" },
    },
  },
  {
    $project: {
      _id: 0,
      title: 1,
      total_revenue: 1,
    },
  },
]);

//8. Find the book with the highest total revenue.
db.orders.aggregate([
  {
    $lookup: {
      from: "books",
      localField: "book_id",
      foreignField: "book_id",
      as: "book",
    },
  },
  { $unwind: "$book" },
  {
    $group: {
      _id: "$book_id",
      total_revenue: { $sum: { $multiply: ["$quantity", "$book.price"] } },
      title: { $first: "$book.title" },
    },
  },
  { $sort: { total_revenue: -1 } },
  { $limit: 1 },
]);

//9. List genres and total books sold in each genre.
db.orders.aggregate([
  {
    $lookup: {
      from: "books",
      localField: "book_id",
      foreignField: "book_id",
      as: "book",
    },
  },
  { $unwind: "$book" },
  {
    $group: {
      _id: "$book.genre",
      total_books_sold: { $sum: "$quantity" },
    },
  },
  {
    $project: {
      genre: "$_id",
      total_books_sold: 1,
      _id: 0,
    },
  },
]);

//10. Show customers who ordered more than 2 different books.
db.orders.aggregate([
  {
    $group: {
      _id: { customer_id: "$customer_id", book_id: "$book_id" },
    },
  },
  {
    $group: {
      _id: "$_id.customer_id",
      different_books: { $sum: 1 },
    },
  },
  { $match: { different_books: { $gt: 2 } } },
  {
    $lookup: {
      from: "customers",
      localField: "_id",
      foreignField: "customer_id",
      as: "customer",
    },
  },
  { $unwind: "$customer" },
  {
    $project: {
      _id: 0,
      customer_name: "$customer.name",
      different_books: 1,
    },
  },
]);
