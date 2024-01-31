const joi = require('joi');

const labelSchema = joi.object({
  name: joi.string().min(1).required(),
});

const labelValidator = (req, res, next) => {
  const { error, value } = labelSchema.validate(req.body, {
    abortEarly: false,
    allowUnknown: true,
  });

  if (error) {
    return res.status(500).json(error);
  } else {
    next();
  }
};

module.exports = labelValidator;
