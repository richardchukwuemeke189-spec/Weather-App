// Centralized error handling middleware
module.exports = (err, req, res, next) => {
  // Log full error details for debugging
  console.error(`[ERROR] ${new Date().toISOString()}`);
  console.error(err.stack);

  // Default status code
  const statusCode = err.statusCode || 500;

  // Customize response based on error type
  let message = 'Something went wrong!';
  if (statusCode === 400) message = 'Bad request';
  if (statusCode === 401) message = 'Unauthorized';
  if (statusCode === 403) message = 'Forbidden';
  if (statusCode === 404) message = 'Resource not found';
  if (statusCode === 500) message = 'Internal server error';

  // Send JSON response
  res.status(statusCode).json({
    error: message,
    // Only include detailed info in development
    ...(process.env.NODE_ENV === 'development' && { details: err.message })
  });
};