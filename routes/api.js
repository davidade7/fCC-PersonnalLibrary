'use strict';

// required modules
require('dotenv').config()
const mongoose = require('mongoose')

// Connection to mongoose
mongoose.connect(process.env['MONGO_URI'])
  .then(() => console.log("Connected to DB"))
  .catch(console.error);;


// Schema for the books
const Book = require('../models/bookSchema')


module.exports = function (app) {

  app.route('/api/books')
    .get(async (req, res) => {
      // Finding all the books
      let result = await Book.find({}).exec()
      
      if (!result) {
        return res.json([])
      }

      // Formating and send the response
      let response = []
      for (let item of result) {
        response.push({"_id": item._id, "title": item.title, "commentcount": item.commentscount})
      }
      res.json(response)
    })
    
    .post((req, res) => {
      let title = req.body.title;
      
      // Check if title is missing
      if (!title) {
        return res.json("missing required field title")
      }

      // Create new book
      let newBook = new Book({ title: title })
      newBook.save()
      // Sending only the _id and title
      res.json({_id : newBook._id, title: newBook.title})       
    })
    
    .delete((req, res) => {
      // Deleting all books
      Book.deleteMany({}).exec()
      res.send("complete delete successful")
    });

  app.route('/api/books/:id')
    .get(async (req, res) => {
      let bookid = req.params.id;
      
      // Finding the book
      try {
        let result = await Book.find({_id: bookid}).exec()
        res.json({_id : result[0]._id, title: result[0].title, comments: result[0].comments})
      }
      catch (e) {
        return res.send("no book exists")
      }
    })
    
    .post(async (req, res) => {
      let bookid = req.params.id;
      let comment = req.body.comment;

      // Check if comment is missing
      if (!comment) {
        return res.json('missing required field comment')
      }

      // Trying to add a comment to the book
      try {
        let book = await Book.findOneAndUpdate({_id: bookid}, {$push: {comments: comment}}).exec()
        book.commentscount += 1;
        book.save();

        // Find the book and send the response
        let result = await Book.find({_id: bookid}).exec()
        res.json({_id : result[0]._id, title: result[0].title, comments: result[0].comments})
      }
      catch (e) {
        return res.json("no book exists")
      }
    })
    
    .delete(async (req, res) => {
      let bookid = req.params.id;

      // Check if book exists
      try {
       const book =  await Book.findOne({_id: bookid}).exec()
       if (!book) {
        return res.json("no book exists");
      }
      }
      catch (e) {
        return res.json("no book exists")
      }

      // Deleting the book
      try {
        const deleteResult = await Book.deleteOne({_id: bookid}).exec()
        
        if (deleteResult.deletedCount === 0) {
          // Si aucun document n'a été supprimé, renvoyer "no book exists"
          return res.json("no book exists");
        }
        
        return res.json("delete successful")
      }
      catch (e) {
        return res.json("no book exists")
      }
    });
};
