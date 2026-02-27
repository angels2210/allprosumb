const router = require("express").Router();
const auth = require("../middleware/auth.middleware");

router.get("/users", auth, (req, res) => res.json([]));
router.post("/users", auth, (req, res) => res.json({ message: "Usuario creado" }));
router.put("/users/:id", auth, (req, res) => res.json({ message: "Usuario actualizado" }));
router.delete("/users/:id", auth, (req, res) => res.json({ message: "Usuario eliminado" }));

router.get("/roles", auth, (req, res) => res.json(["admin", "seller", "client"]));
router.get("/permissions", auth, (req, res) => res.json(["read", "write"]));

router.get("/audit-logs", auth, (req, res) => res.json([]));
router.get("/sellers/performance", auth, (req, res) => res.json([]));
module.exports = router;