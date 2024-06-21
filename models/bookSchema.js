const mongoose = require('mongoose')

// Schema for the issues
const bookSchema = new mongoose.Schema({
  title: { type: String, default: "" },
  comments: { type: [String], default: [] },
  commentscount: { type: Number, default: 0 }
})

// Models
const Book = mongoose.model('Book', bookSchema);

module.exports = Book;