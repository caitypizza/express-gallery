const express = require('express');
let router = express.Router();
const passport = require('passport');
const db = require('./../models');
const { User } = db;

router.route('/')
  .get(( req, res ) => {
    res.render('./login');
  })
  .post(
    // ()=> {console.log('hit')},
    passport.authenticate('local', {
    successRedirect: '/gallery',
    failureRedirect: '/login',
  }));
  // .post( passport.authenticate('local'), function(req, res) {
  //   res.redirect('/gallery');
  // });

router.route('/signup')
  .get(( req, res ) => {
    res.render('./signup');
  })
  .post(( req, res) => {
    // check if username exists
    User.create({ username: req.body.username, password: req.body.password })
    .then((user) => res.redirect(303, '/gallery/'));
  });
  module.exports = router;
