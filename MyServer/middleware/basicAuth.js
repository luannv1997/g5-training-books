function authUser(req, res, next) {
    if (req.userId == null) {
      res.status(403)
      return res.send('You need to sign in')
    }
  
    next()
  }

  
  module.exports = authUser
