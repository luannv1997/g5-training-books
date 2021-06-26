const { PERMISSIONS } = require("../../helpers/constant");

const handleCheckPermissions = (req, res, next) => {
  const role = req.userRole;
  const path = req.baseUrl + req.route.path;
  const method = req.method.toUpperCase();

  let isAllow = false;
  PERMISSIONS.forEach((permission) => {
    
    if (permission.role === role) {
      permission.resources.forEach((resource) => {
        if (resource.path === path) {
          if (typeof resource.methods === 'string') {
            if (resource.methods === "*" || resource.methods.includes(method))
            isAllow = true;
          }
          if (Array.isArray(resource.methods)) {
            if (resource.methods.includes(method)) isAllow = true;
          }
        }
      });
    }
  });
  if (!isAllow) 
  return res.json({success: false, message: "Sorry You not allow!!!!"})
  next();
};

module.exports = handleCheckPermissions