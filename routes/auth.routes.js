const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models");

router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashed });
  res.json(user);
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ where: { email } });
  if (!user) return res.status(400).json({ msg: "Usuario no existe" });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(400).json({ msg: "Contraseña incorrecta" });

  const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1d" });
  res.json({ token, user });
});

// POST /api/clients/login - Login de clientes
router.post("/clients/login", async (req, res) => {
  // TODO: Implementar lógica de login de clientes
  res.json({ token: "client-token", user: { role: "client" } });
});

// POST /api/sales/clients - Registro de nuevos clientes (público)
router.post("/sales/clients", async (req, res) => {
  // TODO: Implementar registro público
  res.json({ message: "Cliente registrado exitosamente" });
});

module.exports = router;
