const router = require("express").Router();
const { Order, OrderItem, Product } = require("../models");
const auth = require("../middleware/auth.middleware");

// Crear pedido
router.post("/", auth, async (req, res) => {
  try {
    const {
      customer_name, customer_phone, customer_id_number, customer_id_type,
      business_name, address, manager_name, seller_name_code,
      payment_method, payment_reference, credit_days, apply_discount, items
    } = req.body;

    let total = 0;
    const order = await Order.create({
      UserId: req.user.id,
      customer_name, customer_phone, customer_id_number, customer_id_type,
      business_name, address, manager_name, seller_name_code,
      payment_method, payment_reference, credit_days, apply_discount,
      total: 0,
      status: 'pendiente'
    });

    for (let item of (items || [])) {
      const product = await Product.findByPk(item.product_id);
      if (!product) continue;

      const subtotal = product.price * item.quantity;
      total += subtotal;

      await OrderItem.create({
        OrderId: order.id,
        ProductId: product.id,
        product_name: product.name,
        quantity: item.quantity,
        price: product.price
      });

      product.stock -= item.quantity;
      await product.save();
    }

    if (apply_discount) total = total * 0.95;
    order.total = total;
    await order.save();

    res.json({ success: true, message: "Orden creada", orderId: order.id });
  } catch (err) {
    console.error("Error creando orden:", err);
    res.status(500).json({ success: false, message: "Error al crear orden" });
  }
});

// Obtener todos los pedidos (admin ve todos, vendedor ve los suyos)
router.get("/", auth, async (req, res) => {
  try {
    const where = req.user.role === 'vendedor' ? { UserId: req.user.id } : {};
    const orders = await Order.findAll({
      where,
      include: [{
        model: OrderItem,
        include: [Product]
      }],
      order: [['createdAt', 'DESC']]
    });

    const formatted = orders.map(order => ({
      id: order.id,
      customer_name: order.customer_name,
      customer_phone: order.customer_phone,
      customer_id_number: order.customer_id_number,
      business_name: order.business_name,
      address: order.address,
      manager_name: order.manager_name,
      seller_name_code: order.seller_name_code,
      total: order.total,
      payment_method: order.payment_method,
      payment_reference: order.payment_reference,
      payment_receipt: order.payment_receipt,
      status: order.status,
      created_at: order.createdAt,
      items: (order.OrderItems || []).map(item => ({
        id: item.id,
        product_name: item.product_name || (item.Product ? item.Product.name : ''),
        quantity: item.quantity,
        price: item.price
      }))
    }));

    res.json(formatted);
  } catch (err) {
    console.error("Error obteniendo órdenes:", err);
    res.status(500).json({ message: "Error al obtener órdenes" });
  }
});

// Obtener pedido por ID
router.get("/:id", auth, async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: [{ model: OrderItem, include: [Product] }]
    });
    if (!order) return res.status(404).json({ message: "Orden no encontrada" });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: "Error al obtener orden" });
  }
});

// Actualizar estado
router.put("/:id/status", auth, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByPk(req.params.id);
    if (!order) return res.status(404).json({ message: "Orden no encontrada" });
    order.status = status;
    await order.save();
    res.json({ message: "Estado actualizado", status });
  } catch (err) {
    res.status(500).json({ message: "Error al actualizar estado" });
  }
});

// Actualizar referencia de pago
router.put("/:id/payment-reference", auth, async (req, res) => {
  try {
    const { reference } = req.body;
    const order = await Order.findByPk(req.params.id);
    if (!order) return res.status(404).json({ message: "Orden no encontrada" });
    order.payment_reference = reference;
    await order.save();
    res.json({ message: "Referencia actualizada", reference });
  } catch (err) {
    res.status(500).json({ message: "Error al actualizar referencia" });
  }
});

module.exports = router;
