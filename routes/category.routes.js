const router = require("express").Router();
const auth = require("../middleware/auth.middleware");

router.get("/", async (req, res) => {
  // Mock data
  res.json([{ id: 1, name: "Electrónica" }, { id: 2, name: "Hogar" }]);
});

router.post("/", auth, async (req, res) => {
  res.json({ message: "Categoría creada", data: req.body });
});

router.put("/:id", auth, async (req, res) => {
  res.json({ message: "Categoría actualizada", id: req.params.id });
});

router.delete("/:id", auth, async (req, res) => {
  res.json({ message: "Categoría eliminada", id: req.params.id });
});

module.exports = router;