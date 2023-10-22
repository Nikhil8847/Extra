const CustomError = require("../errors");

const checkPermissions = (requestUser, resource_id) => {
  if (requestUser.role === "admin") return;
  checkValidUserAccess(requestUser, resource_id);
  throw new CustomError.UnauthorizedError(
    "Not authorized to access this route"
  );
};

const checkValidUserAccess = (requestUser, resource_id) => {
  console.log(requestUser, resource_id);
  if (requestUser._id.toString() === resource_id.toString()) return;
  throw new CustomError.UnauthorizedError(
    "Not authorized to access this route"
  );
};

const userNotOperatingOnItself = (first_id, second_Id) => {
  if (first_id.toString() !== second_Id.toString()) return;
  throw new CustomError.BadRequestError(`Invalid Operation`);
};
module.exports = {
  checkPermissions,
  checkValidUserAccess,
  userNotOperatingOnItself,
};
