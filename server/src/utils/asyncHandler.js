const asyncHandler = (reqHandler) => {
  return async (req, res, next) => {
    try {
      await reqHandler(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};

export default asyncHandler;
