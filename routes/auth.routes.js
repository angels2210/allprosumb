const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models");

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed });
    res.json(user);
  } catch (err) {
    console.error("Error en register:", err);
    res.status(500).json({ msg: "Error al registrar usuario" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const loginField = username || email;
    
    if (!loginField || !password) {
      return res.status(400).json({ success: false, message: "Usuario y contraseña requeridos" });
    }

    // Buscar por username primero, luego por email, luego por name
    let user = await User.findOne({ where: { username: loginField } });
    if (!user) user = await User.findOne({ where: { email: loginField } });
    if (!user) user = await User.findOne({ where: { name: loginField } });

    if (!user) return res.status(400).json({ success: false, message: "Usuario no existe" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ success: false, message: "Contraseña incorrecta" });

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || "supersecreto123",
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        username: user.username || user.name || user.email,
        name: user.name,
        email: user.email,
        role: user.role,
        seller_code: user.seller_code
      }
    });
  } catch (err) {
    console.error("Error en login:", err);
    res.status(500).json({ success: false, message: "Error interno del servidor" });
  }
});

router.post("/clients/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email, role: "client" } });
    if (!user) return res.status(400).json({ success: false, message: "Usuario no existe" });
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ success: false, message: "Contraseña incorrecta" });
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.json({ success: true, token, user });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error interno" });
  }
});

router.post("/sales/clients", async (req, res) => {
  res.json({ message: "Cliente registrado exitosamente" });
});

module.exports = router;
