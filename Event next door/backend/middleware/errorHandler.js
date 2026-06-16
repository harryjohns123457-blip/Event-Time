const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || 'Internal Server Error';

  // Handle MongoDB Duplicate Key Error
  if (err.code === 11000) {
    const message = `Duplicate Field Value Entered`;
    err = new Error(message);
    err.statusCode = 400;
  }

  // Handle JWT Expired Error
  if (err.name === 'JsonWebTokenError') {
    const message = `Invalid JWT Token`;
    err = new Error(message);
    err.statusCode = 400;
  }

  if (err.name === 'TokenExpiredError') {
    const message = `JWT Token Expired`;
    err = new Error(message);
    err.statusCode = 400;
  }

  // Handle Mongoose Validation Error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors)
      .map((val) => val.message)
      .join(', ');
    err = new Error(message);
    err.statusCode = 400;
  }

  return res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};

export default errorHandler;