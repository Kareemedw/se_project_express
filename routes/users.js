const router = require("express").Router();
const { getUsers, createUser, getUser } = require("../controllers/users");
const { BAD_REQUEST_STATUS_CODE } = require("../utils/errors");

router.get("/", getUsers);
router.get("/:userId", getUser);
router.post("/", createUser);

router.use((req, res) => {
  res
    .status(BAD_REQUEST_STATUS_CODE)
    .send({ message: "Requested resource not found" });
});

module.exports = router;
