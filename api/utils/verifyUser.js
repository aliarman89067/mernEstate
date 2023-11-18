import { errorHandler } from "./errorHandler.js";
import jwt from "jsonwebtoken";

export const verifyUser = (req, res, next) => {
  const { access_token } = req.cookies;
  if (!access_token) return next(errorHandler(404, "User Not Authorized"));
  jwt.verify(access_token, process.env.JWT_SECRET, async (error, userData) => {
    if (error) return errorHandler(401, "Token is Not Valid!");
    req.user = userData;
    next();
  });
};
