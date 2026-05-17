const ClothingItem = require("../models/clothingItem");
const {
  BAD_REQUEST_STATUS_CODE,
  INTERNAL_SERVER_ERROR,
  ITEM_NOT_FOUND,
  CREATED,
  REQUEST_STATUS_OK,
  REQUEST_COMPLETED,
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
      return res.status(INTERNAL_SERVER_ERROR).send({ message: err.message });
    });
};

const getItems = (req, res) => {
  ClothingItem.find({})
    .then((item) => res.status(REQUEST_STATUS_OK).send(item))
    .catch((err) => {
      console.error(err);
      return res.status(INTERNAL_SERVER_ERROR).send({ message: err.message });
    });
};

const updateItem = (req, res) => {
  const { itemId } = req.params;
  const { imageUrl } = req.body;

  ClothingItem.findByIdAndUpdate(itemId, { $set: { imageUrl } })
    .orFail()
    .then((item) => res.status(REQUEST_STATUS_OK).send({ data: item }))
    .catch((err) => {
      console.error(err);
      return res.status(INTERNAL_SERVER_ERROR).send({ message: err.message });
    });
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;

  console.log(itemId);

  ClothingItem.findByIdAndDelete({})
    .orFail()
    .then((item) => res.status(REQUEST_COMPLETED).send({ data: item }))
    .catch((err) => {
      console.error(err);
      return res.status(REQUEST_STATUS_OK).send({ message: err.message });
    });
};

module.exports = { createItem, getItems, updateItem, deleteItem };
