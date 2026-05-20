const ClothingItem = require("../models/clothingItem");
const {
  BAD_REQUEST_STATUS_CODE,
  INTERNAL_SERVER_ERROR,
  ITEM_NOT_FOUND,
  CREATED,
  REQUEST_STATUS_OK,
} = require("../utils/errors");

const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  ClothingItem.create({
    name,
    weather,
    imageUrl,
    owner: req.user._id,
  })
    .then((item) => {
      res.status(CREATED).send(item);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res
          .status(BAD_REQUEST_STATUS_CODE)
          .send({ message: err.message });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "Requested resource not found" });
    });
};

const getItems = (req, res) => {
  ClothingItem.find({})
    .then((item) => res.status(REQUEST_STATUS_OK).send(item))
    .catch((err) => {
      console.error(err);
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "Internal Server Error!!" });
    });
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;

  ClothingItem.findByIdAndDelete(itemId)
    .orFail()
    .then((item) => res.status(REQUEST_STATUS_OK).send({ data: item }))
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        return res
          .status(BAD_REQUEST_STATUS_CODE)
          .send({ message: "Invalid item ID" });
      }
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(ITEM_NOT_FOUND)
          .send({ message: "Requested resource not found" });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "Internal Server Error!!" });
    });
};

const likeItem = (req, res) => {
  const { itemId } = req.params;

  ClothingItem.findByIdAndUpdate(
    itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) => {
      res.status(REQUEST_STATUS_OK).send(item);
    })
    .catch((err) => {
      console.error(err);

      if (err.name === "DocumentNotFoundError") {
        return res.status(ITEM_NOT_FOUND).send({ message: "Item not found" });
      }

      if (err.name === "CastError") {
        return res
          .status(BAD_REQUEST_STATUS_CODE)
          .send({ message: "Invalid item ID" });
      }

      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "Internal Server Error!!" });
    });
};

const dislikeItem = (req, res) => {
  const { itemId } = req.params;

  ClothingItem.findByIdAndUpdate(
    itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) => {
      res.status(REQUEST_STATUS_OK).send(item);
    })
    .catch((err) => {
      console.error(err);

      if (err.name === "CastError") {
        return res
          .status(BAD_REQUEST_STATUS_CODE)
          .send({ message: "Invalid item ID" });
      }

      if (err.name === "DocumentNotFoundError") {
        return res.status(ITEM_NOT_FOUND).send({ message: "Item not found" });
      }

      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "Internal Server Error!!" });
    });
};

module.exports = {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  dislikeItem,
};
