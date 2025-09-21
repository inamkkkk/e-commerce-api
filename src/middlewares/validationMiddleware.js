const createHttpError = require('http-errors');

const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    // TODO: Enhance error messages to be more specific, possibly including field names.
    const message = error.details.map((detail) => detail.message).join(', ');
    return next(createHttpError(400, message));
  }
  next();
};

module.exports = validate;