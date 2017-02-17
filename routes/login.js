const express = require('express');
let router = express.Router();
const passport = require('passport');
const db = require('./../models');
const { User } = db;

router.route('/')
  .get(( req, res ) => {
    res.render('./login');
  })
  .post( passport.authenticate('local', {
    successRedirect: '/secret',
    failureRedirect: '/login'
  }));

router.route('/signup')
  .get(( req, res ) => {
    res.render('./signup');
  })
  .post(( req, res) => {
    console.log(req.body);
    User.create({ username: req.body.username, password: req.body.password })
    .then((user) => res.redirect(303, '/gallery/'));
  });
  module.exports = router;
