const ROLE = require("../../helpers/constant");

const handleBookPermission = (req, res, next) => {
  if (req.userRole === ROLE.USER)
    return res
      .status(401)
      .json({ success: false, message: "Users not allowed" });
  next();
};

module.exports = handleBookPermission;
