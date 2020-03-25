var express = require('express');
var router = express.Router();

var db = require('monk')('localhost/nodeblog');

const { check, validationResult } = require('express-validator');

/* GET categories listing. */
router.get('/show/:category', function(req, res, next) {
    var posts = db.get('posts');
    posts.find( {'category': req.params.category}, {}, function(err,posts) {
      res.render('index',{
          'category': req.params.category,
          'posts': posts
      });
    });
});

/* GET categories listing. */
router.get('/add', function(req, res, next) {
    res.render('addcategory',{
        'title': 'Add Category'
    });
});

router.post('/add', [
    check('name').isLength({ min: 3 }).withMessage('Title is required. Min 3 characters.')
    ], function(req, res, next) {
    // Get form values
    var name = req.body.name;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render('addcategory', {"errors": errors.array()});
      console.log("Errors");
      console.log({"errors": errors.array()});
    } else {
      var categories = db.get('categories');
      console.log('No errors');
      console.log(errors);

      categories.insert({
        "name": name
      }, function(err,post){
          if(err) {
            res.send(err);
          } else {
              req.flash('success', 'Category added');
              res.location('/');
              res.redirect('/');
          }
      });
    }

});


module.exports = router;
