const CustomError = require("../errors");
const { isTokenValid } = require("../utils");

const authenticateUser = async (req, res, next) => {
  const token = req.signedCookies.token;
  if (!token) {
    throw new CustomError.UnauthenticatedError("Authentication invalid");
  }
  try {
    const { name, _id, role } = isTokenValid({ token });
    req.user = { name, _id, role };
    next();
  } catch (error) {
    throw new CustomError.UnauthenticatedError("Authentication invalid");
  }
};


const authorizePermissions = (...roles) => {
    // console.log(roles)
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new CustomError.UnauthorizedError("Unauthorized Access");
    }
    next();
  };
};
module.exports = { authenticateUser, authorizePermissions };
