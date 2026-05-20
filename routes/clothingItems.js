const router = require("express").Router();
const {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItems");
const { BAD_REQUEST_STATUS_CODE } = require("../utils/errors");

// CRUD

// Create
router.post("/", createItem);

// Get
router.get("/", getItems);

// Delete
router.delete("/:itemId", deleteItem);

// LIKE
router.put("/:itemId/likes", likeItem);
router.delete("/:itemId/likes", dislikeItem);

router.use((req, res) => {
  res
    .status(BAD_REQUEST_STATUS_CODE)
    .send({ message: "Requested resource not found" });
});

module.exports = router;
