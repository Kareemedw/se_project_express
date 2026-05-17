const router = require("express").Router();
const itemRouter = require("./clothingItems");

const userRouter = require("./users");

router.use("/users", userRouter);
router.use("/items", itemRouter);

module.exports = router;
