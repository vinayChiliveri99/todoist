const joi = require('joi');

const userSchema = joi.object({
  username: joi.string().min(1).trim().required(),
  email: joi.string().email().required(),
  password: joi.string().min(5).required(),
});

const userSignupValidator = (req, res, next) => {
  const { error, value } = userSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    return res.status(500).json(error);
  } else {
    next();
  }
};

const userLoginSchema = joi.object({
  username: joi.string().min(1).trim().required(),
  password: joi.string().min(5).required(),
});

const userLoginValidator = (req, res, next) => {
  const { error, value } = userLoginSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    return res.status(500).json(error);
  } else {
    next();
  }
};

module.exports = { userSignupValidator, userLoginValidator };
