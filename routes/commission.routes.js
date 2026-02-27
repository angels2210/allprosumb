const router = require("express").Router();
const auth = require("../middleware/auth.middleware");

router.get("/:sellerId", auth, (req, res) => {
  res.json([{ id: 1, amount: 15.00, date: new Date() }]);
});

module.exports = router;