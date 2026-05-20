const router = require("express").Router();
const itemRouter = require("./clothingItems");
const { ITEM_NOT_FOUND } = require("../utils/errors");

const userRouter = require("./users");

router.use("/users", userRouter);
router.use("/items", itemRouter);
router.use((req, res) => {
  res.status(ITEM_NOT_FOUND).send({ message: "Requested resource not found" });
});

module.exports = router;
