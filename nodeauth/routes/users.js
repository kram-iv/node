var express = require('express');
var router = express.Router();

var multer = require('multer');
// Handle file uploads
var upload = multer({dest:'./uploads'});

//var User = require('../models/User')

const { check, validationResult } = require('express-validator');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/register', function(req, res, next) {
  console.log("Entering register page...");
  res.render('register', { title: 'Register' });
});

router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Login' });
});

router.post('/register',upload.single('profileImage'),[
    check('name').isLength({ min: 3 }).withMessage('Name is required. Min 3 characters.') ,
    check('email').isEmail().withMessage('Valid email is required.'),
    check('username').isLength({ min: 3 }).withMessage('Username is required. Min 3 characters.'),
    check("password", "Password is required").notEmpty()
        .isLength({min: 6}).withMessage("Password must contain at least 6 characters")
        .isLength({max: 20}).withMessage("Password can contain max 20 characters")
    ], function(req, res, next) {
  var name     = req.body.name;
  var email    = req.body.email;
  var username = req.body.username;
  var password = req.body.password;
  var confirm_password = req.body.ConfirmPassword;

  if ( password !== confirm_password ) {
    console.log('Passwords don\'t match..');
  }

  if (req.file) {
    console.log('Uploading file..');
    var profileimage = req.file.filename;
    console.log('Uploading file..' + profileimage);
  } else {
    console.log('No file uploaded..');
    var profileimage = 'noimage.jpg';
  }

  // Form Validator
  //req.checkBody('name', 'Name field is required').notEmpty();
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.render('register', {"errors": errors.array()});
    console.log("Errors");
    console.log({"errors": errors.array()});
  } else {
    console.log('No errors');
    console.log(errors);
  }
  //res.sendStatus(200);
});

module.exports = router;
