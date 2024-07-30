function notFoundHandler(_, res, _next) {
  res.status(404).send({ status: 404, message: 'Route not found' });
}

export { notFoundHandler };
