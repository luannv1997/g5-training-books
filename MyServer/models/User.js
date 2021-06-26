const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ROLE = require('../helpers/constant')

const UserSchema = new Schema({
    username: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    firstName: {
        type: String,
        require: true
    },
    lastName: {
        type: String,
        require: true
    },
    role: {
        type: String,
        enum: [ROLE.ADMIN, ROLE.USER, ROLE.CONTRIBUTOR],
        default: ROLE.USER,
        require: true
    },
    lastedLogout: {
        type: Date
    },
    lastChangePassword: {
        type: Date
    }
})

module.exports = mongoose.model('users', UserSchema)