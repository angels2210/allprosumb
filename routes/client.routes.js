const router = require("express").Router();
const auth = require("../middleware/auth.middleware");

router.get("/", auth, (req, res) => {
  res.json([{ id: 1, name: "Cliente Ejemplo" }]);
});

router.post("/", auth, (req, res) => {
  res.json({ message: "Cliente creado/actualizado" });
});

router.get("/check", (req, res) => {
  res.json({ exists: false });
});

router.get("/:id/orders", auth, (req, res) => {
  res.json([{ id: 101, total: 50.00, status: "completed" }]);
});

module.exports = router;