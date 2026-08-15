const ClothingItem = require("../models/clothingItem");
const {
  BadRequestStatusCode,
} = require("../utils/errors/BadRequestStatusCode");
const { NotFoundError } = require("../utils/errors/NotFoundError");
const { InternalServerError } = require("../utils/errors/InternalServerError");
const { Forbidden } = require("../utils/errors/Forbidden");

const { CREATED, REQUEST_STATUS_OK } = require("../utils/constants");

const createItem = (req, res, next) => {
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
        return next(new BadRequestStatusCode({ message: "Invalid data" }));
      }
      return next(err);
    });
};

const getItems = (req, res, next) => {
  ClothingItem.find({})
    .then((items) => res.status(REQUEST_STATUS_OK).send(items))
    .catch((err) => {
      console.error(err);
      return next(err);
    });
};

const deleteItem = (req, res, next) => {
  const { itemId } = req.params;

  ClothingItem.findById(itemId)
    .orFail()
    .then((item) => {
      if (item.owner.toString() !== req.user._id) {
        return next(
          new Forbidden({ message: "You are not allowed to delete this item" })
        );
      }

      return ClothingItem.findByIdAndDelete(itemId).then(() =>
        res.status(REQUEST_STATUS_OK).send({ message: "Item deleted" })
      );
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        return next(new BadRequestStatusCode({ message: "Invalid data" }));
      }
      if (err.name === "DocumentNotFoundError") {
        return next(new NotFoundError({ message: "Item not found" }));
      }
      return next(err);
    });
};

const likeItem = (req, res, next) => {
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
        return next(new NotFoundError({ message: "Item not found" }));
      }

      if (err.name === "CastError") {
        return next(new BadRequestStatusCode({ message: "Invalid item id" }));
      }

      return next(
        new InternalServerError({ message: "Internal server error" })
      );
    });
};

const dislikeItem = (req, res, next) => {
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
        return next(new BadRequestStatusCode({ message: "Invalid item id" }));
      }

      if (err.name === "DocumentNotFoundError") {
        return next(new NotFoundError({ message: "Item not found" }));
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
