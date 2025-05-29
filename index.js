const express = require('express');
const passport = require('passport');
const session = require('express-session');
const GitHubStrategy = require('passport-github2').Strategy;
require('dotenv').config();

const app = express();

// Session middleware
app.use(session({
  secret: 'secret', 
  resave: false, 
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());
app.set('view engine', 'ejs');

// Serialize/Deserialize user
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

// GitHub strategy
passport.use(new GitHubStrategy({
  clientID: process.env.GIT_CLIENT,
  clientSecret: process.env.GIT_SECRET,
  callbackURL: "http://localhost:4000/auth/github/callback"
}, (accessToken, refreshToken, profile, done) => {
  // Normally you'd save to DB here
  return done(null, profile);
}));

// Routes
app.get('/', (req, res) => {
  res.send(`<h1>Hello!</h1><a href="/auth/github">Login with GitHub</a>`);
});


app.get('/auth/github',
  passport.authenticate('github', { scope: ['user:email'] })
);

app.get('/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/' }),
  (req, res) => {
    //console.log(req.user);
    res.send(`Hello ${req.user.username}`);
  }
);

app.listen(4000, () => {
  console.log("Server is running on http://localhost:4000");
});
