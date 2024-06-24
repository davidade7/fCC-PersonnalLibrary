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
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      let result = await Book.find({}).exec()
      let resonse = []
      // formating the response
      for (let item of result) {
        resonse.push({"_id": item._id, "title": item.title, "commentcount": item.commentscount})
      }
      res.json(resonse)
    })
    
    .post(function (req, res){
      //response will contain new book object including atleast _id and title
      let title = req.body.title;
      
      // check if title is missing
      if (!title) {
        return res.send("missing required field title")
      }

      // create new book
      let newBook = new Book({ title: title })
      newBook.save()
      res.json({_id : newBook._id, title: newBook.title})       
    })
    
    .delete(function(req, res){
      //if successful response will be 'complete delete successful'
      Book.deleteMany({}).exec()
      res.send("complete delete successful")
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      let bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
    })
    
    .post(function(req, res){
      let bookid = req.params.id;
      let comment = req.body.comment;
      //json res format same as .get
    })
    
    .delete(function(req, res){
      let bookid = req.params.id;
      //if successful response will be 'delete successful'
    });
  
};
