const router = require("express").Router();
const itemRouter = require("./clothingItems");
const { NotFoundError } = require("../utils/errors/NotFoundError");
const { login, createUser } = require("../controllers/users");
const auth = require("../middlewares/auth");
const { getItems } = require("../controllers/clothingItems");
const {
  validateUserBody,
  validateAuthentication,
} = require("../middlewares/validation");

const userRouter = require("./users");

router.post("/signin", validateAuthentication, login);
router.post("/signup", validateUserBody, createUser);
router.get("/items", getItems);

router.use(auth);

router.use("/users", userRouter);
router.use("/items", itemRouter);
router.use((req, res, next) => {
  next(new NotFoundError("Requested resource not found"));
});

module.exports = router;
