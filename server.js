"use strict";

const express = require('express');
const bodyParser = require('body-parser');
const handlebars = require('express-handlebars');
const methodOverride = require('method-override');
const session  = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const RedisStore = require('connect-redis')(session);
const PORT = process.env.PORT || 3000;
const app = express();

const hbs = handlebars.create({
  extname: 'hbs',
  defaultLayout: 'app',
});
const bcrypt = require('bcrypt-nodejs');

const saltRounds = 10;

// helpers
const getUser = require('./helpers/getUser');
// const isAuthenticated = require('./helpers/isAuthenticated');

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');

// redis for cacheing
const redis = require('redis');
let client = redis.createClient();
const cache = require('express-redis-cache')({client: client, expire: 60});

app.use(express.static('./'));

app.use(bodyParser.urlencoded({ extended : true }));

// app.use(methodOverride('_method'));

app.use(methodOverride('X-HTTP-Method-Override'));
app.use(methodOverride((req, res) => {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    var method = req.body._method;
    delete req.body._method;
    return method;
  }
}));

// authentication w/ passport
app.use(session({
  store: new RedisStore(),
  secret: "keyboard_cat",
  resave: false,
  saveUnititialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({
      where: {
        username: username
      }
    }).then((user) => {
      if(user === null){
        return done(null, false, {message: 'bad username'});
      }else{
        bcrypt.compare(password, user.password).then((res)=> {
          if(res){
            return done(null, user);
          }else{
            return done(null, false, {message: 'bad password'});
          }
        });
      }
    })
    .catch((err) => {
      return done(null, err);
    });
  }
));

// storing into database
passport.serializeUser(function(user, done) {
  return done(null, user);
});

// retrieving from database
passport.deserializeUser(function(user, done) {
  return done(null, user);
});

// MODELS
const db = require('./models');
const {User} = db;

// ROUTES
const gallery = require('./routes/gallery');
const login = require('./routes/login');

app.use('/gallery', getUser, gallery);
app.use('/login', login);


app.listen(PORT, () => {
  console.log('listening on', PORT);
  db.sequelize.sync();
});