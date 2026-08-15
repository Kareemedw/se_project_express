const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { JWT_SECRET } = require("../utils/config");

const User = require("../models/user");

const {
  BadRequestStatusCode,
} = require("../utils/errors/BadRequestStatusCode");
const { NotFoundError } = require("../utils/errors/NotFoundError");
const { Conflict } = require("../utils/errors/Conflict");
const { UnauthorizedError } = require("../utils/errors/UnauthorizedError");

const { CREATED, REQUEST_STATUS_OK } = require("../utils/constants");

// GET /users

const createUser = (req, res, next) => {
  if (!req.body) {
    return next(
      new BadRequestStatusCode({
        message: "Request body is missing",
      })
    );
  }

  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return next(
      new BadRequestStatusCode({
        message: "name, email, and password are required",
      })
    );
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
        return next(new Conflict({ message: "Email already exist" }));
      }

      if (err.name === "ValidationError") {
        return next(new BadRequestStatusCode({ message: "Invalid user data" }));
      }

      return next(err);
    });
};

const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail()
    .then((user) => res.status(REQUEST_STATUS_OK).send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return next(new NotFoundError({ message: "User not found" }));
      }
      return next(err);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(
      new BadRequestStatusCode({
        message: "Email and password are required",
      })
    );
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
        return next(new UnauthorizedError("Incorrect email or password"));
      }

      return next(err);
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
        return next(new NotFoundError({ message: "User not found" }));
      }

      if (err.name === "ValidationError") {
        return next(
          new BadRequestStatusCode({
            message: "Email and password are required",
          })
        );
      }

      return next(err);
    });
};

module.exports = {
  createUser,
  getCurrentUser,
  login,
  updateCurrentUser,
};
