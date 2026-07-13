/**
 * Centralized error response helper
 */

const errorHandler = (res, error, statusCode = 500) => {
  console.error('Error:', error.message || error);
  return res.status(statusCode).json({
    success: false,
    message: error.message || 'Server error',
  });
};

const notFound = (res, resource = 'Resource') => {
  return res.status(404).json({
    success: false,
    message: `${resource} not found`,
  });
};

const validationError = (res, errors) => {
  return res.status(400).json({
    success: false,
    message: 'Validation failed',
    errors,
  });
};

module.exports = { errorHandler, notFound, validationError };
