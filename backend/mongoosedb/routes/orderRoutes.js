const express = require('express');
const router = express.Router();
const orderController = require('../controller/orderController');

// Route để lấy revenue spikes
router.get('/revenue-spikes', orderController.getRevenueSpikes);
router.get('/loyal-customers', orderController.getLoyalCustomers);

// Các route khác
router.post('/', orderController.createOrder);
router.get('/:id', orderController.getOrderById);

module.exports = router;
