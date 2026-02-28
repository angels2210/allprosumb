const router = require("express").Router();
const { User } = require("../models");
const auth = require("../middleware/auth.middleware");

// Verificar si cliente existe por id_number e id_type (campos en name)
router.get("/check", async (req, res) => {
  try {
    const { id_number, id_type } = req.query;
    const fullId = `${id_type}${id_number}`;
    // Buscamos por nombre que coincida (guardamos cédula en name como fallback)
    const user = await User.findOne({ where: { name: fullId, role: "client" } });
    if (user) {
      res.json({ id: user.id, name: user.name });
    } else {
      res.json(null);
    }
  } catch (err) {
    res.status(500).json({ message: "Error al verificar cliente" });
  }
});

router.get("/", auth, async (req, res) => {
  try {
    const clients = await User.findAll({ where: { role: "client" }, attributes: ['id', 'name', 'email'] });
    res.json(clients);
  } catch (err) {
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