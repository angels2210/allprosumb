const router = require("express").Router();
const auth = require("../middleware/auth.middleware");

router.get("/settings/banner", (req, res) => res.json({ url: "https://via.placeholder.com/1200x300" }));
router.get("/settings/logo", (req, res) => res.json({ url: "https://via.placeholder.com/150" }));
router.get("/settings/contact", (req, res) => res.json({ phone: "+58 000 0000000", email: "contacto@empresa.com" }));

router.get("/bcv-rate", (req, res) => res.json({ rate: 36.50, lastUpdated: new Date() }));
router.put("/bcv-rate", auth, (req, res) => res.json({ message: "Tasa actualizada", rate: req.body.rate }));

module.exports = router;