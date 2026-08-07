const { Joi, celebrate } = require("celebrate");
const validator = require("validator");

const validateURL = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }

  return helpers.error("string.uri");
};

const validateClothingItemBody = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      "string.min": 'The minimum length of the "name" field is 2',
      "string.max": 'The maximum length of the "name" field is 30',
      "string.empty": 'The "name" field must be filled in',
    }),

    imageUrl: Joi.string().required().custom(validateURL).messages({
      "string.empty": 'The "imageUrl" field must be filled in',
      "string.uri": 'the "imageUrl" field must be a valid url',
    }),

    weather: Joi.string().required().valid("hot", "warm", "cold").messages({
      "string.empty": 'The "weather" field must be filled in',
      "any.required": 'The "weather" field is required',
      "any.only": 'The "weather" field must be one of: hot, warm, or cold',
    }),
  }),
});

const validateUserBody = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).messages({
      "string.min": 'The minimum length of the "name" field is 2',
      "string.max": 'The maximum length of the "name" field is 30',
      "string.empty": 'The "name" field must be filled in',
      "any.required": 'The "name" field is required',
    }),

    avatar: Joi.string().custom(validateURL).messages({
      "string.min": 'The minimum length of the "avatar" field is 2',
      "string.empty": 'The "avatar" field must be filled in',
      "any.required": 'The "name" field is required',
    }),
  }),
});

const validateAuthentication = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email().messages({
      "string.min": 'The minimum length of the "email" field is 2',
      "string.max": 'The maximum length of the "email" field is 30',
      "string.empty": 'The "email" field must be filled in',
    }),

    password: Joi.string().required().messages({
      "string.empty": 'The "password" field must be filled in',
      "any.required": 'The "password" field is required',
    }),
  }),
});

const validateId = celebrate({
  params: Joi.object().keys({
    itemId: Joi.string().required().hex().length(24).messages({
      "string.empty": "Item ID is required",
      "any.required": "Item ID is required",
      "string.hex": "Item ID must be a valid hexadecimal value",
      "string.length": "Item ID must be exactly 24 characters long",
    }),
  }),
});

const validateUserId = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().required().hex().length(24).messages({
      "string.empty": "User ID is required",
      "any.required": "User ID is required",
      "string.hex": "User ID must be a valid hexadecimal value",
      "string.length": "User ID must be exactly 24 characters long",
    }),
  }),
});

module.exports = {
  validateClothingItemBody,
  validateUserBody,
  validateAuthentication,
  validateId,
  validateUserId,
  validateURL,
};
