const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { JWT_SECRET } = require("../utils/config");

const User = require("../models/user");

const {
  BAD_REQUEST_STATUS_CODE,
  INTERNAL_SERVER_ERROR,
  ITEM_NOT_FOUND,
  CREATED,
  REQUEST_STATUS_OK,
  INVALID_AUTHENTICATION,
  CONFLICT,
} = require("../utils/errors");

// GET /users

const createUser = (req, res) => {
  if (!req.body) {
    return res.status(BAD_REQUEST_STATUS_CODE).send({
      message: "Request body is missing",
    });
  }

  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).send({
      message: "name, email, and password are required",
    });
  }

  return bcrypt
    .hash(password, 10)
    .then((hash) =>
      User.create({
        name,
        email,
        password: hash,
      }).then((user) =>
        res.status(CREATED).send({
          name: user.name,
          email: user.email,
          _id: user._id,
        })
      )
    )
    .catch((err) => {
      console.error(err);
      if (err.code === 11000) {
        err.statusCode = CONFLICT;
        err.message = "Email already exists";
      }

      if (err.name === "ValidationError") {
        err.statusCode = BAD_REQUEST_STATUS_CODE;
        err.message = "Invalid user data";
      }

      next(err);
    });
};

const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail()
    .then((user) => res.status(REQUEST_STATUS_OK).send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        err.statusCode = ITEM_NOT_FOUND;
        err.message = "Item not found";
      }
      next(err);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(BAD_REQUEST_STATUS_CODE).send({
      message: "Email and password are required",
    });
  }
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });

      res.send({ token });
    })
    .catch((err) => {
      console.error(err);

      if (err.message === "Incorrect email or password") {
        err.statusCode = INVALID_AUTHENTICATION;
        err.message = "Incorrect email or password";
      }

      next(err);
    });
};

const updateCurrentUser = (req, res, next) => {
  const { name, avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, avatar },
    {
      new: true,
      runValidators: true,
    }
  )
    .orFail()
    .then((user) => res.status(REQUEST_STATUS_OK).send(user))
    .catch((err) => {
      console.error(err);

      if (err.name === "DocumentNotFoundError") {
        err.statusCode = ITEM_NOT_FOUND;
        err.message = "User not found";
      }

      if (err.name === "ValidationError") {
        return res;
        err.statusCode = BAD_REQUEST_STATUS_CODE;
        err.message = "Invalid user data";
      }

      next(err);
    });
};

module.exports = {
  createUser,
  getCurrentUser,
  login,
  updateCurrentUser,
};
