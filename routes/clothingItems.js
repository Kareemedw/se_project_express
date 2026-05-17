const router = require("express").Router();
const {
  createItem,
  getItems,
  updateItem,
  deleteItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItems");

//CRUD

//Create
router.post("/", createItem);

//Get
router.get("/", getItems);

//Update
router.put("/:itemId", updateItem);

//Delete
router.delete("/:itemId", deleteItem);

//LIKE
router.put("/:itemId/likes", likeItem);
router.delete("/:itemId/likes", dislikeItem);

module.exports = router;
