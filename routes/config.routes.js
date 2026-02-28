const router = require("express").Router();
const { Setting } = require("../models");
const auth = require("../middleware/auth.middleware");

// Helper para obtener un setting
const getSetting = async (key, defaultValue) => {
  const setting = await Setting.findOne({ where: { key } });
  return setting ? JSON.parse(setting.value) : defaultValue;
};

// Helper para guardar un setting
const setSetting = async (key, value) => {
  await Setting.upsert({ key, value: JSON.stringify(value) });
};

// Logo
router.get("/settings/logo", async (req, res) => {
  try {
    const data = await getSetting("logo", { logo_url: "" });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Error al obtener logo" });
  }
});

router.put("/settings/logo", auth, async (req, res) => {
  try {
    await setSetting("logo", { logo_url: req.body.logo_url });
    res.json({ logo_url: req.body.logo_url });
  } catch (err) {
    res.status(500).json({ message: "Error al guardar logo" });
  }
});

// Banner
router.get("/settings/banner", async (req, res) => {
  try {
    const data = await getSetting("banner", { title: "Bienvenido", subtitle: "", image_url: "" });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Error al obtener banner" });
  }
});

router.put("/settings/banner", auth, async (req, res) => {
  try {
    const { title, subtitle, image_url } = req.body;
    await setSetting("banner", { title, subtitle, image_url });
    res.json({ title, subtitle, image_url });
  } catch (err) {
    res.status(500).json({ message: "Error al guardar banner" });
  }
});

// Contacto
router.get("/settings/contact", async (req, res) => {
  try {
    const data = await getSetting("contact", { phone: "+58 000 0000000", footerText: "ALLPROSUM 33, C.A. J-12345678-9" });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Error al obtener contacto" });
  }
});

router.put("/settings/contact", auth, async (req, res) => {
  try {
    const { phone, footerText } = req.body;
    await setSetting("contact", { phone, footerText });
    res.json({ phone, footerText });
  } catch (err) {
    res.status(500).json({ message: "Error al guardar contacto" });
  }
});

// Tasa BCV
router.get("/bcv-rate", async (req, res) => {
  try {
    const data = await getSetting("bcv-rate", { rate: 36.50, lastUpdated: new Date() });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Error al obtener tasa BCV" });
  }
});

router.put("/bcv-rate", auth, async (req, res) => {
  try {
    const data = { rate: req.body.rate, lastUpdated: new Date() };
    await setSetting("bcv-rate", data);
    res.json({ message: "Tasa actualizada", ...data });
  } catch (err) {
    res.status(500).json({ message: "Error al guardar tasa BCV" });
  }
});

module.exports = router;