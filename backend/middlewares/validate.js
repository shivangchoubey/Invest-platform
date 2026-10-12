const validate = (schema) => (req, res, next) => {
  try {
    req.body = schema.parse(req.body);
    next();
  } catch (error) {
    const errorMessages = error.issues?.map((issue) => issue.message) || [];
    return res.status(400).json({
      message: error.issues?.[0]?.message || "Validation failed",
      errors: errorMessages,
    });
  }
};

export default validate;