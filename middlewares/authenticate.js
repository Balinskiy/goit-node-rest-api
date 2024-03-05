import jwt from "jsonwebtoken";
import HttpError from "../helpers/HttpError.js";
import "dotenv/config";
import User from "../models/user.js";

function authenticate(req, res, next) {
  const { authorization } = req.headers;
  if (!authorization) {
    return next(HttpError(401, "Not authorized"));
  }

  const [bearer, token] = authorization.split(" ", 2);

  if (bearer !== "Bearer") {
    return next(HttpError(401, "Not authorized"));
  }

  jwt.verify(token, process.env.JWT_SECRET, async (error, decode) => {
    if (error) {
      if (error.name === "TokenExpiredError") {
        return next(HttpError(401, "Token expired"));
      }
      return next(HttpError(401, "Not authorized"));
    }

    const user = await User.findById(decode.id);
    if (user === null) {
      return next(HttpError(401, "Not authorized"));
    }

    if (user.token !== token) {
      return next(HttpError(401, "Not authorized"));
    }

    req.user = {
      id: decode.id,
    };

    next();
  });
}

export default authenticate;