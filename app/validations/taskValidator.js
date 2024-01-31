const Joi = require('joi');

const taskSchema = Joi.object({
  content: Joi.string().min(1).required(),
  description: Joi.string().min(1),
  project_id: Joi.string(),
  section_id: Joi.string().valid('list', 'board'),
  parent_id: Joi.string(),
  order: Joi.number(),
  labels: Joi.array().items(Joi.string()),
  priority: Joi.number(),
  due_string: Joi.string(),
  due_date: Joi.date(),
  due_datetime: Joi.date(),
  due_lang: Joi.string().max(2),
  assignee_id: Joi.string(),
  duration: Joi.number(),
  duration_unit: Joi.string(),
});

const taskValidator = (req, res, next) => {
  const { error, value } = taskSchema.validate(req.body, {
    abortEarly: false,
    allowUnknown: true,
  });
  if (error) {
    return res.status(500).json(error);
  } else {
    next();
  }
};

module.exports = taskValidator;
