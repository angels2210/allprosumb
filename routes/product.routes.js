const router = require("express").Router();
const { Product } = require("../models");
const auth = require("../middleware/auth.middleware");

router.post("/", auth, async (req, res) => {
  const product = await Product.create(req.body);
  res.json(product);
});

router.get("/", async (req, res) => {
  const products = await Product.findAll();
  res.json(products);
});

router.put("/:id", auth, async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: "Producto no encontrado" });
    await product.update(req.body);
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: "Error al actualizar producto" });
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: "Producto no encontrado" });
    await product.destroy();
    res.json({ message: "Producto eliminado", id: req.params.id });
  } catch (err) {
    res.status(500).json({ message: "Error al eliminar producto" });
  }
});

module.exports = router;
