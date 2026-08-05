const router = require("express").Router();

const {
  validateClothingItemBody,
  validateId,
} = require("../middlewares/validation");

const {
  createItem,
  deleteItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItems");

// CRUD

// Create
router.post("/", validateClothingItemBody, createItem);

// Delete
router.delete("/:itemId", validateId, deleteItem);

// LIKE
router.put("/:itemId/likes", validateId, likeItem);
router.delete("/:itemId/likes", validateId, dislikeItem);

module.exports = router;
