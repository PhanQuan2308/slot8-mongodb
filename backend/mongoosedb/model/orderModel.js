const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  product_id: String,
  product_name: String,
  quantity: Number,
  price: Number,
  item_total: Number,
});

const orderSchema = new mongoose.Schema({
  transaction_id: String,
  transaction_date: Date,
  customer_id: String,
  customer_name: String,
  items: [itemSchema],
  total_amount: Number,
});

const Order = mongoose.model('transactions', orderSchema);

module.exports = Order;
