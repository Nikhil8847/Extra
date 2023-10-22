const BadRequestError = require("./bad-request")
const UnauthenticatedError = require('./unauthenticated')
const CustomAPIError = require("./custom-error");
const NotFoundError = require("./not-found");
const UnauthorizedError = require("./unauthorized");
module.exports = {
  BadRequestError,
  UnauthenticatedError,
  CustomAPIError,
  NotFoundError,
  UnauthorizedError
};