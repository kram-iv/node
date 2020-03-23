var express = require('express');
var router = express.Router();
var multer = require('multer');
// Handle file uploads
var upload = multer({dest:'./uploads'});
var db = require('monk')('localhost/nodeblog');

var $ = require("jquery");/*
require("jsdom").env("", function(err, window) {
    if (err) {
        console.error(err);
        return;
    }

    var $ = require("jquery")(window);
});*/
//const ClassicEditor = require( '@ckeditor/ckeditor5-build-classic' );

const { check, validationResult } = require('express-validator');

/* GET postslisting. */
router.get('/add', function(req, res, next) {
  var categories = db.get('categories');
  categories.find( {}, {}, function(err,categories) {
    res.render('addpost',{
        'title': 'Add post',
        'categories': categories
    });
/*
    ClassicEditor
    .create( document.querySelector( '#body' ) )
    .then( editor => {
        console.log( editor );
    })
    .catch( error => {
        console.error( error );
    });
*/
  });
});

router.post('/add', upload.single('mainimage'),[
    check('title').isLength({ min: 3 }).withMessage('Title is required. Min 3 characters.') ,
    check('body').isLength({ min: 3 }).withMessage('Body is required.')
    ], function(req, res, next) {
    // Gete form values
    var title = req.body.title;
    var category = req.body.category;
    var body = req.body.body;
    var author = req.body.author;
    var date = new Date();

    if(req.file) {
        var mainimage = req.file.filename;
    } else {
        var mainimage = 'noimage.jpg';
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render('addpost', {"errors": errors.array()});
      console.log("Errors");
      console.log({"errors": errors.array()});
    } else {
      var posts = db.get('posts');
      console.log('No errors');
      console.log(errors);

      posts.insert({
        "title": title,
        "body": body,
        "category": category,
        "date": date,
        "author": author,
        "mainimage": mainimage
      }, function(err,post){
          if(err) {
            res.send(err);
          } else {
              req.flash('success', 'Post added');
              res.location('/');
              res.redirect('/');
          }
      });
    }

});


module.exports = router;
