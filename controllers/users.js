const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { JWT_SECRET } = require("../utils/config");

const User = require("../models/user");

const {
  BadRequestStatusCode,
  InternalServerError,
  ItemNotFound,
  Conflict,
} = require("../utils/errors");

const { Created, RequestStatusOk } = require("../utils/constants");

// GET /users

const createUser = (req, res, next) => {
  if (!req.body) {
    return res.status(BadRequestStatusCode).send({
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
        res.status(Created).send({
          name: user.name,
          email: user.email,
          _id: user._id,
        })
      )
    )
    .catch((err) => {
      console.error(err);
      if (err.code === 11000) {
        return next(new Conflict({ message: "Email already exist" }));
      }

      if (err.name === "ValidationError") {
        return next(new BadRequestStatusCode({ message: "Invalid user data" }));
      }

      next(err);
    });
};

const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail()
    .then((user) => res.status(RequestStatusOk).send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        err.statusCode = ItemNotFound;
        err.message = "Item not found";
      }
      next(err);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(BadRequestStatusCode).send({
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
        return next(
          new InvalidAuthentication({ message: "Incorrect email or password" })
        );
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
    .then((user) => res.status(RequestStatusOk).send(user))
    .catch((err) => {
      console.error(err);

      if (err.name === "DocumentNotFoundError") {
        err.statusCode = ItemNotFound;
        err.message = "User not found";
      }

      if (err.name === "ValidationError") {
        return res;
        err.statusCode = BadRequestStatusCode;
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
