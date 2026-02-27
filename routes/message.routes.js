const router = require("express").Router();
const { Message } = require("../models");
const auth = require("../middleware/auth.middleware");

router.post("/", auth, async (req, res) => {
  const message = await Message.create({
    content: req.body.content,
    sender: req.user.role,
    UserId: req.user.id
  });

  res.json(message);
});

router.get("/:userId", auth, async (req, res) => {
  const messages = await Message.findAll({
    where: { UserId: req.params.userId }
  });

  res.json(messages);
});

module.exports = router;
