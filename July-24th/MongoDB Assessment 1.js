db.products.insertMany([
  {
    product_id: 1001,
    name: "Wireless Mouse",
    category: "Electronics",
    price: 750,
    stock: 120,
  },
  {
    product_id: 1002,
    name: "Bluetooth Speaker",
    category: "Electronics",
    price: 2200,
    stock: 80,
  },
  {
    product_id: 1003,
    name: "Yoga Mat",
    category: "Fitness",
    price: 599,
    stock: 150,
  },
  {
    product_id: 1004,
    name: "Office Chair",
    category: "Furniture",
    price: 7500,
    stock: 40,
  },
  {
    product_id: 1005,
    name: "Running Shoes",
    category: "Footwear",
    price: 3500,
    stock: 60,
  },
]);

db.orders.insertMany([
  {
    order_id: 5001,
    customer: "Ravi Shah",
    product_id: 1001,
    quantity: 2,
    order_date: new Date("2024-07-01"),
  },
  {
    order_id: 5002,
    customer: "Sneha Mehta",
    product_id: 1002,
    quantity: 1,
    order_date: new Date("2024-07-02"),
  },
  {
    order_id: 5003,
    customer: "Arjun Verma",
    product_id: 1003,
    quantity: 3,
    order_date: new Date("2024-07-03"),
  },
  {
    order_id: 5004,
    customer: "Neha Iyer",
    product_id: 1001,
    quantity: 1,
    order_date: new Date("2024-07-04"),
  },
  {
    order_id: 5005,
    customer: "Mohit Jain",
    product_id: 1005,
    quantity: 2,
    order_date: new Date("2024-07-05"),
  },
]);

//1. List all products in the Electronics category.
db.products.find({ category: "Electronics" });

//2. Find all orders placed by Ravi Shah.
db.orders.find({ customer: "Ravi Shah" });

//3. Show all orders placed after July 2, 2024.
db.orders.find({ order_date: { $gt: new Date("2024-07-02") } });

//4. Display the product with stock less than 50.
db.products.find({ stock: { $lt: 50 } });

//5. Show all products that cost more than 2000.
db.products.find({ price: { $gt: 2000 } });

//6. Use $lookup to show each order with the product name and price.
db.orders.aggregate([
  {
    $lookup: {
      from: "products",
      localField: "product_id",
      foreignField: "product_id",
      as: "product_info",
    },
  },
  { $unwind: "$product_info" },
  {
    $project: {
      order_id: 1,
      customer: 1,
      "product_info.name": 1,
      "product_info.price": 1,
      quantity: 1,
    },
  },
]);

//7. Find total amount spent by each customer (price × quantity).
db.orders.aggregate([
  {
    $lookup: {
      from: "products",
      localField: "product_id",
      foreignField: "product_id",
      as: "product_info",
    },
  },
  { $unwind: "$product_info" },
  {
    $group: {
      _id: "$customer",
      totalSpent: { $sum: { $multiply: ["$quantity", "$product_info.price"] } },
    },
  },
]);

//8. List all orders along with category of the product.
db.orders.aggregate([
  {
    $lookup: {
      from: "products",
      localField: "product_id",
      foreignField: "product_id",
      as: "product_info",
    },
  },
  { $unwind: "$product_info" },
  {
    $project: {
      order_id: 1,
      customer: 1,
      product_category: "$product_info.category",
    },
  },
]);

//9. Find customers who ordered any Fitness product.
db.orders.aggregate([
  {
    $lookup: {
      from: "products",
      localField: "product_id",
      foreignField: "product_id",
      as: "product_info",
    },
  },
  { $unwind: "$product_info" },
  { $match: { "product_info.category": "Fitness" } },
  { $group: { _id: "$customer" } },
]);

//10. Find the total sales per product category.
db.orders.aggregate([
  {
    $lookup: {
      from: "products",
      localField: "product_id",
      foreignField: "product_id",
      as: "product_info",
    },
  },
  { $unwind: "$product_info" },
  {
    $group: {
      _id: "$product_info.category",
      totalSales: { $sum: { $multiply: ["$quantity", "$product_info.price"] } },
    },
  },
]);

//11. Count how many units of each product have been sold.
db.orders.aggregate([
  { $group: { _id: "$product_id", totalUnitsSold: { $sum: "$quantity" } } },
]);

//12. Calculate average price of products per category.
db.products.aggregate([
  { $group: { _id: "$category", avgPrice: { $avg: "$price" } } },
]);

//13. Find out which customer made the largest single order (by amount).
db.orders.aggregate([
  {
    $lookup: {
      from: "products",
      localField: "product_id",
      foreignField: "product_id",
      as: "product_info",
    },
  },
  { $unwind: "$product_info" },
  {
    $addFields: {
      orderAmount: { $multiply: ["$quantity", "$product_info.price"] },
    },
  },
  { $sort: { orderAmount: -1 } },
  { $limit: 1 },
]);

//14. List the top 3 products based on number of orders.
db.orders.aggregate([
  { $group: { _id: "$product_id", totalOrders: { $sum: 1 } } },
  { $sort: { totalOrders: -1 } },
  { $limit: 3 },
]);

//15. Determine which day had the highest number of orders.
db.orders.aggregate([
  { $group: { _id: "$order_date", totalOrders: { $sum: 1 } } },
  { $sort: { totalOrders: -1 } },
  { $limit: 1 },
]);

//16. Add a new customer who hasn't placed any orders. Write a query to list customers without orders (simulate this).
db.customers.insertOne({ name: "Anita Kumar" }); // create customers collection
db.customers.aggregate([
  {
    $lookup: {
      from: "orders",
      localField: "name",
      foreignField: "customer",
      as: "order_info",
    },
  },
  { $match: { order_info: { $size: 0 } } },
]);

//17. Add more orders and find customers who have placed more than one order.
db.orders.aggregate([
  { $group: { _id: "$customer", orderCount: { $sum: 1 } } },
  { $match: { orderCount: { $gt: 1 } } },
]);

//18. Find all products that have never been ordered.
db.products.aggregate([
  {
    $lookup: {
      from: "orders",
      localField: "product_id",
      foreignField: "product_id",
      as: "order_info",
    },
  },
  { $match: { order_info: { $size: 0 } } },
]);

//19. Display customers who placed orders for products with stock less than 100.
db.orders.aggregate([
  {
    $lookup: {
      from: "products",
      localField: "product_id",
      foreignField: "product_id",
      as: "product_info",
    },
  },
  { $unwind: "$product_info" },
  { $match: { "product_info.stock": { $lt: 100 } } },
  { $group: { _id: "$customer" } },
]);

//20. Show the total inventory value (price × stock) for all products.
db.products.aggregate([
  {
    $group: {
      _id: null,
      totalInventoryValue: { $sum: { $multiply: ["$price", "$stock"] } },
    },
  },
]);
