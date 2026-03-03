const router = require("express").Router();
const auth = require("../middleware/auth.middleware");
const { Order, OrderItem, Product } = require("../models");

router.get("/:sellerId", auth, async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { UserId: parseInt(req.params.sellerId) },
      include: [{ model: OrderItem, include: [Product] }],
      order: [["createdAt", "DESC"]]
    });

    const commissions = orders.map(order => {
      const total = order.total || 0;
      const amount = parseFloat((total * 0.05).toFixed(2));
      return {
        id: order.id,
        order_id: order.id,
        customer_name: order.customer_name || 'N/A',
        order_total: total,
        amount: amount,
        status: order.status === 'approved' ? 'paid' : 'pending',
        created_at: order.createdAt
      };
    });

    res.json(commissions);
  } catch (err) {
    console.error("Error obteniendo comisiones:", err);
    res.status(500).json({ message: "Error al obtener comisiones" });
  }
});

module.exports = router;