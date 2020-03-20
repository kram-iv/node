var express = require('express');
var router = express.Router();

var multer = require('multer');
// Handle file uploads
var upload = multer({dest:'./uploads'});
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var User = require('../models/User');

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

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});

router.post('/login',
  passport.authenticate('local',{
                failureRedirect:'/users/login', failureFlash:'Invalid username or password',
                successRedirect:'/', successFlash:'You are now logged in'}));

passport.use (new LocalStrategy(function(username, password, done){
  User.getUserByUsername(username, function(err,user){
    if (err) throw err;
    if(!user) {
      return done(null, false,{message: 'Unkwown User'});
    }
    User.comparePassword(password, user.password, function(err, isMatch){
      if(err) return done(err);
      if(isMatch) {
        console.log("Password match successful!!");
        return done(null, user);
      } else {
        return done(null, false, {message: 'Invalid Password'});
      }
    });
  });
}));

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

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.render('register', {"errors": errors.array()});
    console.log("Errors");
    console.log({"errors": errors.array()});
  } else {
    console.log('No errors');
    console.log(errors);

    var newUser = new User({
      name: name,
      email: email,
      username: username,
      password: password,
      profileimage: profileimage
    });

    User.createUser(newUser, function(err, user){
      if (err) throw err;
      console.log(user);
    });

    req.flash('success','You\'re now registered and can login!');
    res.location('/');
    res.redirect('/');
  }
  //res.sendStatus(200);
});

router.get('/logout', function(req, res){
  req.logout();
  req.flash('success', 'You are now logged out.');
  res.redirect('/users/login');
});

module.exports = router;
