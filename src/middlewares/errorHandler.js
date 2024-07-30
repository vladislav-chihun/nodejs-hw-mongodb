function errorHandler(err, req, res, next) {
  res.status(err.status || 500).json({
    status: 'error',
    message: err.message || 'Something went wrong',
    data: err.data || null,
  });
}

export default errorHandler;
