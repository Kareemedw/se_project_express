const ClothingItem = require("../models/clothingItem");
const {
  BadRequestStatusCode,
  InternalServerError,
  ItemNotFound,
  Forbidden,
} = require("../utils/errors");

const { Created, RequestStatusOk } = require("../utils/constants");

const createItem = (req, res, next) => {
  const { name, weather, imageUrl } = req.body;
  ClothingItem.create({
    name,
    weather,
    imageUrl,
    owner: req.user._id,
  })
    .then((item) => {
      res.status(Created).send(item);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return next(new BadRequestStatusCode({ message: "Invalid data" }));
      }
      next(err);
    });
};

const getItems = (req, res, next) => {
  ClothingItem.find({})
    .then((items) => res.status(RequestStatusOk).send(items))
    .catch((err) => {
      console.error(err);
      next(err);
    });
};

const deleteItem = (req, res, next) => {
  const { itemId } = req.params;

  ClothingItem.findById(itemId)
    .orFail()
    .then((item) => {
      if (item.owner.toString() !== req.user._id) {
        return res
          .status(Forbidden)
          .send({ message: "You are not allowed to delete this item" });
      }

      return ClothingItem.findByIdAndDelete(itemId).then(() =>
        res.status(RequestStatusOk).send({ message: "Item deleted" })
      );
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        return next(new BadRequestStatusCode({ message: "Invalid data" }));
      }
      if (err.name === "DocumentNotFoundError") {
        return next(new ItemNotFound({ message: "Item not found" }));
      }
      next(err);
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
      res.status(RequestStatusOk).send(item);
    })
    .catch((err) => {
      console.error(err);

      if (err.name === "DocumentNotFoundError") {
        return res.status(ItemNotFound).send({ message: "Item not found" });
      }

      if (err.name === "CastError") {
        return next(new BadRequestStatusCode({ message: "Invalid item id" }));
      }

      return next(
        new InternalServerError({ message: "Internal server error" })
      );
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
      res.status(RequestStatusOk).send(item);
    })
    .catch((err) => {
      console.error(err);

      if (err.name === "CastError") {
        return next(new BadRequestStatusCode({ message: "Invalid item id" }));
      }

      if (err.name === "DocumentNotFoundError") {
        return res.status(ItemNotFound).send({ message: "Item not found" });
      }

      return next(
        new InternalServerError({ message: "Internal Server Error!!" })
      );
    });
};

module.exports = {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  dislikeItem,
};
