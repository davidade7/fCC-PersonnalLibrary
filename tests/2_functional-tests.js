/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {

  suite('Routing tests', function() {
    let bookId;

    suite('POST /api/books with title => create book object/expect book object', function() {
      
      test('Test POST /api/books with title', function(done) {
        // Setup
        let book = { title: "Test Book" }
        
        // Test
        chai.request(server)
          // .keepOpen()
          .post('/api/books')
          .send(book)
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.property(res.body, '_id');
            assert.property(res.body, 'title');
            assert.equal(res.body.title, book.title);
            bookId = res.body._id;
            done();
          })
      });
      
      test('Test POST /api/books with no title given', function(done) {
        // Setup
        let book = {}
        
        // Test
        chai.request(server)
        .keepOpen()  
        .post('/api/books')
          .send(book)
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body, "missing required field title");
            done();
          })
      });
    });


    suite('GET /api/books => array of books', function(){
      test('Test GET /api/books',  function(done){
        chai.request(server)
          .keepOpen()
          .get('/api/books')
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.isArray(res.body, 'response should be an array');
            assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
            assert.property(res.body[0], 'title', 'Books in array should contain title');
            assert.property(res.body[0], '_id', 'Books in array should contain _id');
            done();
        });
      });      
    });


    suite('GET /api/books/[id] => book object with [id]', function(){
      
      test('Test GET /api/books/[id] with id not in db',  function(done){
        chai.request(server)
          .keepOpen()
          .get('/api/books/66798fa505116fxxxxxxdac22')
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.equal(res.body, "no book exists");
            done();
        });
      });
      
      test('Test GET /api/books/[id] with valid id in db',  function(done){
        chai.request(server)
        .keepOpen()
        .get(`/api/books/${bookId}`)
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isObject(res.body, 'response should be an object');
          assert.property(res.body, 'comments', 'Books in object should contain comments');
          assert.property(res.body, 'title', 'Books in object should contain title');
          assert.property(res.body, '_id', 'Books in arrobjectay should contain _id');
          done();
        });
      });
    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function(){
      
      test('Test POST /api/books/[id] with comment', function(done){
        // Setup
        let comment = { comment: "Test comment" }
                
        // Test
        chai.request(server)
          .keepOpen()
          .post(`/api/books/${bookId}`)
          .send(comment)
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.property(res.body, '_id');
            assert.property(res.body, 'title');
            assert.property(res.body, 'comments'); 
            // Check if array is not empty
            assert.isNotEmpty(res.body.comments);
            done();
          })
      });

      test('Test POST /api/books/[id] without comment field', function(done){
        // Setup
        let comment = { comment: "" }
                
        // Test
        chai.request(server)
          .keepOpen()
          .post(`/api/books/${bookId}`)
          .send(comment)
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body, "missing required field comment");
            done();
          })
      });

      test('Test POST /api/books/[id] with comment, id not in db', function(done){
        // Setup
        let comment = { comment: "new comment" }
                
        // Test
        chai.request(server)
          .keepOpen()
          .post(`/api/books/66798fa505116fxxxxxxxxxxxtest`)
          .send(comment)
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body, "no book exists");
            done();
          })
      });
      
    });

    suite('DELETE /api/books/[id] => delete book object id', function() {

      test('Test DELETE /api/books/[id] with valid id in db', function(done){
        // Test
        chai.request(server)
          .keepOpen()
          .delete(`/api/books/${bookId}`)
          .send({id: bookId})
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body, "delete successful");
            done();
          })
      });

      test('Test DELETE /api/books/[id] with id not in db', function(done){
        // Test
        chai.request(server)
          .keepOpen()
          .delete(`/api/books/falseidtest`)
          .send({id: "falseidtest"})
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body, "no book exists");
            done();
          })
      });

    });

  });

});
