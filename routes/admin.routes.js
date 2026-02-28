const router = require("express").Router();
const { User } = require("../models");
const bcrypt = require("bcryptjs");
const auth = require("../middleware/auth.middleware");

router.get("/users", auth, async (req, res) => {
  try {
    const users = await User.findAll({ attributes: ['id', 'name', 'email', 'role', 'seller_code'] });
    const mapped = users.map(u => ({ ...u.toJSON(), username: u.name }));
    res.json(mapped);
  } catch (err) {
    res.status(500).json({ message: "Error al obtener usuarios" });
  }
});

router.post("/users", auth, async (req, res) => {
  try {
    const { username, password, role, seller_code } = req.body;
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name: username, password: hashed, role, seller_code });
    res.json({ ...user.toJSON(), username: user.name });
  } catch (err) {
    res.status(500).json({ message: "Error al crear usuario" });
  }
});

router.put("/users/:id", auth, async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: "No encontrado" });
    const updates = { name: req.body.username, role: req.body.role, seller_code: req.body.seller_code };
    if (req.body.password) updates.password = await bcrypt.hash(req.body.password, 10);
    await user.update(updates);
    res.json({ ...user.toJSON(), username: user.name });
  } catch (err) {
    res.status(500).json({ message: "Error al actualizar usuario" });
  }
});

router.delete("/users/:id", auth, async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: "No encontrado" });
    await user.destroy();
    res.json({ message: "Usuario eliminado" });
  } catch (err) {
    res.status(500).json({ message: "Error al eliminar usuario" });
  }
});

router.get("/roles", auth, (req, res) => res.json(["admin", "vendedor", "client"]));
router.get("/permissions", auth, (req, res) => res.json([]));
router.get("/audit-logs", auth, (req, res) => res.json([]));
router.get("/sellers/performance", auth, (req, res) => res.json([]));
router.get("/sellers/:id/performance", auth, (req, res) => res.json(null));

module.exports = router;