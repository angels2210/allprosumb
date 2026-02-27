const router = require("express").Router();
const { Order, OrderItem, Product } = require("../models");
const auth = require("../middleware/auth.middleware");

router.post("/", auth, async (req, res) => {
  const { products } = req.body; // [{ productId, quantity }]

  let total = 0;

  const order = await Order.create({
    UserId: req.user.id,
    total: 0
  });

  for (let item of products) {
    const product = await Product.findByPk(item.productId);
    if (!product) continue;

    const subtotal = product.price * item.quantity;
    total += subtotal;

    await OrderItem.create({
      OrderId: order.id,
      ProductId: product.id,
      quantity: item.quantity,
      price: product.price
    });

    product.stock -= item.quantity;
    await product.save();
  }

  order.total = total;
  await order.save();

  res.json({ message: "Orden creada", orderId: order.id });
});

router.get("/", auth, async (req, res) => {
  const orders = await Order.findAll({
    where: { UserId: req.user.id },
    include: {
      model: OrderItem,
      include: Product
    }
  });

  res.json(orders);
});

router.get("/:id", auth, async (req, res) => {
  // const order = await Order.findByPk(req.params.id, { include: [OrderItem] });
  res.json({ id: req.params.id, status: "pending", items: [] });
});

router.put("/:id/status", auth, async (req, res) => {
  const { status } = req.body;
  // Actualizar estado
  res.json({ message: "Estado actualizado", status });
});

router.put("/:id/payment-reference", auth, async (req, res) => {
  const { reference } = req.body;
  res.json({ message: "Referencia de pago actualizada", reference });
});

module.exports = router;
