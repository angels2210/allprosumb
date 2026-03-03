const router = require("express").Router();
const { User, Order } = require("../models");
const { Op } = require("sequelize");
const auth = require("../middleware/auth.middleware");

// Verificar si cliente existe
router.get("/check", async (req, res) => {
  try {
    const { id_number, id_type } = req.query;
    const fullId = `${id_type}${id_number}`;

    const lastOrder = await Order.findOne({
      where: {
        [Op.or]: [
          { customer_id_number: fullId },
          { customer_id_number: id_number }
        ]
      },
      order: [["createdAt", "DESC"]]
    });

    if (lastOrder) {
      res.json({
        id: lastOrder.id,
        customer_name: lastOrder.customer_name || '',
        customer_phone: lastOrder.customer_phone || '',
        business_name: lastOrder.business_name || '',
        address: lastOrder.address || '',
        manager_name: lastOrder.manager_name || ''
      });
    } else {
      res.json(null);
    }
  } catch (err) {
    console.error("Error verificando cliente:", err);
    res.status(500).json({ message: "Error al verificar cliente" });
  }
});

// Obtener todos los clientes desde órdenes
router.get("/", auth, async (req, res) => {
  try {
    const orders = await Order.findAll({
      attributes: ['customer_id_number', 'customer_name', 'customer_phone', 'business_name', 'address', 'createdAt'],
      order: [["createdAt", "DESC"]]
    });

    // Deduplicar por customer_id_number
    const seen = new Set();
    const clients = [];
    for (const o of orders) {
      const id = o.customer_id_number;
      if (id && !seen.has(id)) {
        seen.add(id);
        clients.push({
          id: clients.length + 1,
          identification: id,
          name: o.business_name || o.customer_name || '-',
          customer_name: o.customer_name || '-',
          phone: o.customer_phone || '-',
          address: o.address || '-',
          type: id.startsWith('J') ? 'juridica' : 'natural',
          created_at: o.createdAt
        });
      }
    }

    res.json(clients);
  } catch (err) {
    console.error("Error obteniendo clientes:", err);
    res.status(500).json({ message: "Error al obtener clientes" });
  }
});

router.post("/", auth, async (req, res) => {
  try {
    const { customer_name, customer_id_number, customer_id_type } = req.body;
    const fullId = `${customer_id_type}${customer_id_number}`;
    const [user] = await User.findOrCreate({
      where: { name: fullId, role: "client" },
      defaults: { name: fullId, password: "cliente123", role: "client" }
    });
    res.json({ id: user.id, name: user.name });
  } catch (err) {
    res.status(500).json({ message: "Error al crear cliente" });
  }
});

router.get("/:id/orders", auth, async (req, res) => {
  res.json([]);
});

module.exports = router;