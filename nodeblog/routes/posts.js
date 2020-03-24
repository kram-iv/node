var express = require('express');
var router = express.Router();
var multer = require('multer');
// Handle file uploads
var upload = multer({dest:'./public/images'});
var db = require('monk')('localhost/nodeblog');

const { check, validationResult } = require('express-validator');

router.get('/show/:id', function(req, res, next) {
    var posts = db.get('posts');
    posts.findOne( req.params.id, {}, function(err,post) {
      res.render('show',{
          'post': post
      });
    });
  });

/* GET posts listing. */
router.get('/add', function(req, res, next) {
  var categories = db.get('categories');
  categories.find( {}, {}, function(err,categories) {
    res.render('addpost',{
        'title': 'Add post',
        'categories': categories
    });
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

router.post('/addcomment', [
    check('name').isLength({ min: 3 }).withMessage('Name is required. Min 3 characters.'),
    check('email').isEmail().withMessage('Valid email is required.'),
    check('body').isLength({ min: 3 }).withMessage('Body is required. Min 3 characters.') ,
    ], function(req, res, next) {
    // Get form values
    var name   = req.body.name;
    var email  = req.body.email;
    var body   = req.body.body;
    var postid = req.body.postid;
    var commentdate = new Date();

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      var posts = db.get('posts');
      posts.findOne(postid, function(err,post){
        res.render('show', {
            "errors": errors.array(),
            "post": post
        });
      });

      console.log("Errors");
      console.log({"errors": errors.array()});
    } else {
      var comment = {
        "name": name,
        "email": email,
        "body": body,
        "commentdate": commentdate
      };
      var posts = db.get('posts');

      posts.update({
          "_id": postid
        },{
          $push: {
                "comments": comment
            }
        }, function(err,doc) {
            if(err) {
                throw err;
            } else {
                req.flash('success', 'Comment Added');
                res.location('/posts/show/' + postid);
                res.redirect('/posts/show/' + postid);
            }
        });
    }

});

module.exports = router;
