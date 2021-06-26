const mongoose = require('mongoose')
const Schema = mongoose.Schema

const BookSchema = new Schema({
    title: {
        type: String,
        require: true
    },
    author: {
        type: String,
        require: true
    },
    owner: {
        type: Schema.ObjectId,
        ref: 'users',
        require: true
    },
    cover: {
        type: String
    },
    description: {
        type: String
    },
    category: {
        type: Schema.ObjectId,
        ref: 'categories',
        require: true
    }
})

module.exports = mongoose.model('books', BookSchema)