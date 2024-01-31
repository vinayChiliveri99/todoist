const joi = require('joi');

const commentSchema = joi.object({
  content: joi.string().min(1).required(),
});

const commnetValidator = (req, res, next) => {
  const { error, value } = commentSchema.validate(req.body, {
    abortEarly: false,
    allowUnknown: true,
  });

  if (error) {
    return res.status(500).json(error);
  } else {
    next();
  }
};

module.exports = commnetValidator;
