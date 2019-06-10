const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const passportConfig= require('../config/passport');
// Load User model
const {Class,User}=require('../models');


// Login Page
router.get('/login', (req, res) => {
  res.send(true)
});

// Duplicate User
router.get('/duplicate/:userID', (req, res) => {
  var {userID} = req.params
  User.findOne({userID: userID}).then(user => {
    if (user)
      res.send(true)
    else
      res.send(false)
  });
})

router.get('/validate/:classCode', (req, res) => {
  var {classCode} = req.params;
  Class.findOne({classCode: classCode}).then(thisclass => {
    if (thisclass)
      res.send(true)
    else
      res.send(false)
  });
})

// Register
router.post('/signup', (req, res) => {
  const { userName, userID, studentId, password } = req.body;
    const newUser = new User({
      userName: userName,
      studentId: studentId,
      userID: userID,
      password: password
    });
    User.findOne({userID:userID}).then(ID=>{
      if(ID){
        res.send(false);
      }
      else{
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
                .save()
                .then(user => {
                  console.log(userID + '회원 등록되었습니다.');
                  res.send(true);
                })
                .catch(err => console.log(err));
          });
        });
      }
    })
});
passportConfig();

// Login
router.post('/login',
    passport.authenticate('local'),
    function(req, res) {
      let Identity;
      if(req.user.studentId == "9999")
        Identity = 2;
      else 
        Identity = 1;
      res.send({
        Identity: Identity,
        userName: req.user.userName,
        studentId: req.user.studentId,
        userID: req.user.userID,
        classList: req.user.classList
      });
      
});

// Logout
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.send("logout");
});

router.post('/withdraw',(req,res)=>{
  const {userID,password} =req.body;
  User.findOne({userID:userID}).then(ID=>{
    if(ID){
      bcrypt.compare(password, ID.password, (err, isMatch) => {
        if (err) throw err;
        if (isMatch) {
          ID.remove();
          res.send(true);
        } else {
          res.send(false)
        }
      })
    }else{res.send(false)}
  })
})

//autologin
router.get('/', (req,res)=>{
  let sessionCheck = false;
  if (typeof req !== 'undefined' && typeof req.user !== 'undefined') {
    sessionCheck = true
  }
  res.send(sessionCheck);
});
module.exports = router;
