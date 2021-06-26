const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CategorySchema = new Schema({
    title: {
        type: String,
        enum: ['Category 1', 'Category 2', 'Category 3']
    }
})

module.exports = mongoose.model('categories', CategorySchema)
