const jwt = require('jsonwebtoken')
const UserModel = require('../models/User')

const verifyToken = async (req, res, next) => {
	const authHeader = req.header('Authorization')
	const token = authHeader && authHeader.split(' ')[1]

	if (!token)
		return res
			.status(401)
			.json({ success: false, message: 'Access token not found' })

	try {
		const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
		// GET User

		const user = await UserModel.findOne({_id: decoded.userId});
		console.log(user.lastedLogout)
		console.log(decoded.timeCreate)
		if (user.lastedLogout != null && decoded.timeCreate < user.lastedLogout.getTime()) {
			throw "error"
		}
		if (user.lastChangePassword != null && decoded.timeCreate < user.lastChangePassword.getTime()) {
			throw "error"
		}

		req.userId = decoded.userId
		req.userRole = decoded.userRole
		next()
	} catch (error) {
		console.log(error)
		return res.status(403).json({ success: false, message: 'Invalid token' })
	}
}

module.exports = verifyToken