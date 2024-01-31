const joi = require('joi');

const projectSchema = joi.object({
  name: joi.string().min(1).required(),
  color: joi.string().min(1),
  is_favorite: joi.boolean(),
  view_style: joi.string().valid('list', 'board'),
});

const projectValidator = (req, res, next) => {
  const { error, value } = projectSchema.validate(req.body, {
    abortEarly: false,
    allowUnknown: true,
  });

  if (error) {
    return res.status(500).json(error);
  } else {
    next();
  }
};

module.exports = projectValidator;
