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
  // const product = await Product.findByPk(req.params.id);
  // await product.update(req.body);
  res.json({ message: "Producto actualizado", id: req.params.id });
});

router.delete("/:id", auth, async (req, res) => {
  // const product = await Product.findByPk(req.params.id);
  // await product.destroy();
  res.json({ message: "Producto eliminado", id: req.params.id });
});

module.exports = router;
