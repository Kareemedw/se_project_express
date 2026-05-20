const router = require("express").Router();
const {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItems");

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

module.exports = router;
