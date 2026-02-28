const router = require("express").Router();
const { Category } = require("../models");
const auth = require("../middleware/auth.middleware");

router.get("/", async (req, res) => {
  try {
    const categories = await Category.findAll();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: "Error al obtener categorías" });
  }
});

router.post("/", auth, async (req, res) => {
  try {
    const category = await Category.create({ name: req.body.name });
    res.json(category);
  } catch (err) {
    res.status(500).json({ message: "Error al crear categoría" });
  }
});

router.put("/:id", auth, async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) return res.status(404).json({ message: "Categoría no encontrada" });
    await category.update({ name: req.body.name });
    res.json(category);
  } catch (err) {
    res.status(500).json({ message: "Error al actualizar categoría" });
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) return res.status(404).json({ message: "Categoría no encontrada" });
    await category.destroy();
    res.json({ message: "Categoría eliminada", id: req.params.id });
  } catch (err) {
    res.status(500).json({ message: "Error al eliminar categoría" });
  }
});

module.exports = router;