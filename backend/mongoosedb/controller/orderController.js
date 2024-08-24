const Order = require("../model/orderModel");

const createOrder = async (req, res) => {
  try {
    const newOrder = new Order(req.body);
    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(500).json({ message: "Error creating order", error });
  }
};

const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Error fetching order", error });
  }
};

const getRevenueSpikes = async (req, res) => {
  try {
    console.log(
      "Starting to calculate weekly revenue spikes for each product in December 2023"
    );

    const spikes = await Order.aggregate([
      {
        $match: {
          transaction_date: {
            $gte: new Date("2023-12-01"),
            $lte: new Date("2023-12-31"),
          },
        },
      },
      {
        $unwind: "$items",
      },
      {
        $group: {
          _id: {
            product_id: "$items.product_id",
            week: { $isoWeek: "$transaction_date" }, 
          },
          totalRevenue: { $sum: "$items.item_total" },
        },
      },
      {
        $sort: { "_id.product_id": 1, "_id.week": 1 },
      },
      {
        $group: {
          _id: "$_id.product_id",
          weeklyData: {
            $push: {
              week: "$_id.week",
              totalRevenue: "$totalRevenue",
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          product_id: "$_id",
          weeklyData: 1,
        },
      },
      {
        $sort: { "weeklyData.totalRevenue": -1 }, 
      },
      {
        $limit: 5, 
      },
    ]);

    console.log("Weekly spikes for December 2023 calculated:", spikes);

    res.json(spikes);
  } catch (error) {
    console.error("Error calculating weekly revenue spikes:", error);

    res
      .status(500)
      .json({ message: "Error calculating weekly revenue spikes", error });
  }
};

const getLoyalCustomers = async (req, res) => {
  try {
    const loyalCustomers = await Order.aggregate([
      {
        $unwind: "$items",
      },
      {
        $group: {
          _id: {
            customer_id: "$customer_id",
            month: { $month: "$transaction_date" },
            day: { $dayOfMonth: "$transaction_date" },
            hour: { $hour: "$transaction_date" },
            product_id: "$items.product_id"
          },
          totalQuantity: { $sum: "$items.quantity" },
          totalSpent: { $sum: "$items.item_total" }
        },
      },
      {
        $sort: {
          "_id.customer_id": 1,
          "_id.month": 1,
          totalSpent: -1,
          totalQuantity: -1,
        },
      },
      {
        $group: {
          _id: {
            customer_id: "$_id.customer_id",
            month: "$_id.month"
          },
          totalSpent: { $sum: "$totalSpent" },
          favoriteProduct: {
            $push: {
              product_id: "$_id.product_id",
              totalQuantity: "$totalQuantity"
            }
          },
          favoriteDay: { $first: "$_id.day" },
          favoriteHour: { $first: "$_id.hour" },
          totalQuantity: { $first: "$totalQuantity" }
        },
      },
      {
        $project: {
          _id: 0,
          customer_id: "$_id.customer_id",
          month: "$_id.month",
          totalSpent: 1,
          favoriteProduct: 1,
          favoriteDay: 1,
          favoriteHour: 1,
          totalQuantity: 1
        },
      },
      {
        $group: {
          _id: "$customer_id",
          monthlyData: {
            $push: {
              month: "$month",
              totalSpent: "$totalSpent",
              favoriteProduct: "$favoriteProduct.product_id",
              favoriteDay: "$favoriteDay",
              favoriteHour: "$favoriteHour",
              totalQuantity: "$totalQuantity"
            }
          },
          totalSpent: { $sum: "$totalSpent" }
        },
      },
      {
        $match: {
          "monthlyData.0": { $exists: true }
        }
      },
      {
        $sort: { totalSpent: -1 }  // Sắp xếp theo tổng chi tiêu từ cao xuống thấp
      },
      {
        $limit: 5  // Giới hạn kết quả trả về chỉ còn 5 khách hàng
      },
      {
        $project: {
          _id: 0,
          customer_id: "$_id",
          totalSpent: 1,
          monthlyData: 1,
        },
      }
    ]);

    res.json(loyalCustomers);
  } catch (error) {
    console.error("Error calculating loyal customers' behavior:", error);
    res.status(500).json({ message: "Error calculating loyal customers' behavior", error });
  }
};


module.exports = {
  createOrder,
  getOrderById,
  getRevenueSpikes,
  getLoyalCustomers,
};
