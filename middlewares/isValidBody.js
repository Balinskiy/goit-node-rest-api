import HttpError from "../helpers/HttpError.js";

const isValidBody = (req, res, next) => {
  const { length } = Object.keys(req.body);
  if (!length) {
    return next(HttpError(400, "The data is not valid"));
  }
  next();
};

export default isValidBody;
