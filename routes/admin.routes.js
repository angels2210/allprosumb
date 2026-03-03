const router = require("express").Router();
const bcrypt = require("bcryptjs");
const auth = require("../middleware/auth.middleware");
const { User, Order, OrderItem, Product, Setting, AuditLog } = require("../models");
const { Op } = require("sequelize");

// GET todos los usuarios
router.get("/users", auth, async (req, res) => {
  try {
    const users = await User.findAll({
      where: { role: { [Op.ne]: "client" } },
      attributes: ["id", "username", "name", "email", "role", "seller_code"]
    });
    res.json(users.map(u => ({
      id: u.id,
      username: u.username || u.name || u.email,
      role: u.role,
      seller_code: u.seller_code
    })));
  } catch (err) {
    console.error("Error obteniendo usuarios:", err);
    res.status(500).json({ message: "Error al obtener usuarios" });
  }
});

// POST crear usuario
router.post("/users", auth, async (req, res) => {
  try {
    const { username, password, role, seller_code } = req.body;
    if (!username || !password) return res.status(400).json({ message: "Username y password requeridos" });
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      name: username,
      email: `${username}@allprosum.local`,
      password: hashed,
      role: role || "vendedor",
      seller_code: seller_code || null
    });

    await AuditLog.create({
      UserId: req.user.id,
      action: "CREATE_USER",
      details: `Usuario creado: ${user.username} (${user.role})`
    });

    res.json({ id: user.id, username: user.username, role: user.role, seller_code: user.seller_code });
  } catch (err) {
    console.error("Error creando usuario:", err);
    if (err.name === "SequelizeUniqueConstraintError") return res.status(400).json({ message: "El usuario ya existe" });
    res.status(500).json({ message: "Error al crear usuario" });
  }
});

// PUT actualizar usuario
router.put("/users/:id", auth, async (req, res) => {
  try {
    const { username, role, password, seller_code } = req.body;
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });
    user.username = username || user.username;
    user.name = username || user.name;
    user.role = role || user.role;
    user.seller_code = seller_code !== undefined ? seller_code : user.seller_code;
    if (password && password.trim() !== "") user.password = await bcrypt.hash(password, 10);
    await user.save();

    await AuditLog.create({
      UserId: req.user.id,
      action: "UPDATE_USER",
      details: `Usuario actualizado: ${user.username}`
    });

    res.json({ id: user.id, username: user.username, role: user.role, seller_code: user.seller_code });
  } catch (err) {
    console.error("Error actualizando usuario:", err);
    res.status(500).json({ message: "Error al actualizar usuario" });
  }
});

// DELETE eliminar usuario
router.delete("/users/:id", auth, async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });
    
    await AuditLog.create({
      UserId: req.user.id,
      action: "DELETE_USER",
      details: `Usuario eliminado: ${user.username}`
    });

    await user.destroy();
    res.json({ message: "Usuario eliminado" });
  } catch (err) {
    res.status(500).json({ message: "Error al eliminar usuario" });
  }
});

// GET roles
router.get("/roles", auth, (req, res) => {
  res.json(["administrador", "vendedor", "soporte"]);
});

// GET permisos por rol (devuelve objeto { role: permissions[] } para cada rol)
router.get("/permissions", auth, async (req, res) => {
  try {
    const roles = ["administrador", "vendedor", "soporte"];
    const availablePermissions = ["dashboard", "users", "products", "orders", "settings", "chat", "reports"];
    
    // Leer permisos guardados de cada rol desde Settings
    const result = {};
    for (const role of roles) {
      const setting = await Setting.findOne({ where: { key: `permissions_${role}` } });
      result[role] = setting ? JSON.parse(setting.value) : availablePermissions; // por defecto todos los permisos
    }
    
    res.json({ rolePermissions: result, availablePermissions });
  } catch (err) {
    console.error("Error obteniendo permisos:", err);
    res.status(500).json({ message: "Error al obtener permisos" });
  }
});

// POST guardar permisos
router.post("/permissions", auth, async (req, res) => {
  try {
    const { role, permissions } = req.body;
    if (!role || !Array.isArray(permissions)) {
      return res.status(400).json({ message: "Datos inválidos" });
    }

    // Guardamos los permisos en la tabla Settings con una clave única por rol
    await Setting.upsert({
      key: `permissions_${role}`,
      value: JSON.stringify(permissions)
    });

    res.json({ message: "Permisos actualizados", role, permissions });
  } catch (err) {
    console.error("Error guardando permisos:", err);
    res.status(500).json({ message: "Error al guardar permisos" });
  }
});

// GET audit logs
router.get("/audit-logs", auth, async (req, res) => {
  try {
    const logs = await AuditLog.findAll({ order: [["createdAt", "DESC"]], limit: 100 });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: "Error al obtener logs" });
  }
});

// GET performance todos los vendedores
router.get("/sellers/performance", auth, async (req, res) => {
  try {
    const sellers = await User.findAll({
      where: { role: "vendedor" },
      attributes: ["id", "username", "name", "seller_code"]
    });
    const result = await Promise.all(sellers.map(async (seller) => {
      const orders = await Order.findAll({
        where: { UserId: seller.id },
        order: [["createdAt", "DESC"]]
      });
      const approved = orders.filter(o => o.status === "approved");
      const total_sales = approved.reduce((sum, o) => sum + o.total, 0);
      return {
        id: seller.id,
        username: seller.username || seller.name,
        seller_code: seller.seller_code,
        total_orders: orders.length,
        total_sales,
        total_commissions: parseFloat((total_sales * 0.05).toFixed(2)),
        top_products: [],
        recent_orders: orders.slice(0, 5).map(o => ({
          id: o.id,
          customer_name: o.customer_name,
          total: o.total,
          status: o.status,
          created_at: o.createdAt
        }))
      };
    }));
    res.json(result);
  } catch (err) {
    console.error("Error sellers performance:", err);
    res.status(500).json({ message: "Error" });
  }
});

// GET performance vendedor individual
router.get("/sellers/:id/performance", auth, async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { UserId: parseInt(req.params.id) },
      order: [["createdAt", "DESC"]]
    });
    const approved = orders.filter(o => o.status === "approved");
    const total_sales = approved.reduce((sum, o) => sum + o.total, 0);
    res.json({
      total_orders: orders.length,
      total_sales,
      total_commissions: parseFloat((total_sales * 0.05).toFixed(2)),
      top_products: [],
      recent_orders: orders.slice(0, 10).map(o => ({
        id: o.id,
        customer_name: o.customer_name,
        total: o.total,
        status: o.status,
        created_at: o.createdAt
      }))
    });
  } catch (err) {
    console.error("Error seller performance:", err);
    res.status(500).json({ message: "Error" });
  }
});

module.exports = router;