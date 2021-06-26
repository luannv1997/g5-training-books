const ROLE = require("../../helpers/constant");

const handleUserPermission = (req, res, next) => {
  if (req.userRole !== ROLE.ADMIN)
  return res.status(401).json({ success: false, message: "Users not allowed" });
  next()
};

module.exports = handleUserPermission;
