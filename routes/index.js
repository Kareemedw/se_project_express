const router = require("express").Router();
const itemRouter = require("./clothingItems");
const { ITEM_NOT_FOUND } = require("../utils/errors");
const { login, createUser } = require("../controllers/users");
const auth = require("../middlewares/auth");
const { getItems } = require("../controllers/clothingItems");

const userRouter = require("./users");

router.post("/signin", login);
router.post("/signup", createUser);
router.get("/items", getItems);

router.use(auth);

router.use("/users", userRouter);
router.use("/items", itemRouter);
router.use((req, res) => {
  res.status(ITEM_NOT_FOUND).send({ message: "Requested resource not found" });
});

module.exports = router;
