var express = require("express");
var app  = express();
const exphbs = require('express-handlebars');

var appId = "1335478790143022";
var appSecret = "4f510c4d36b03f0dc08818f122461ab5";
const https = require('https')
const fs = require('fs')
var path = require('path');

var user = {};
var accessToken = '';
var refreshToken = '';

var passport = require("passport");

var FacebookStrategy = require("passport-facebook").Strategy;

app.use(passport.initialize())

app.use(passport.session())

 passport.serializeUser(function(user, done) {
    done(null, user);
  });
  
  passport.deserializeUser(function(obj, done) {
    done(null, obj);
  });
  
  passport.use(
    new FacebookStrategy(
      {
        clientID: appId,
        clientSecret: appSecret,
        callbackURL: "https://localhost:3737/auth/facebook/callback",
        profileFields: ['id', 'displayName', 'name', 'gender', 'picture.type(large)']
      },
      function(accessToken, refreshToken, profile, cb) {
        user = profile;
        accessToken = accessToken;
        refreshToken = refreshToken;
        return cb(null, profile)
      }
    )
  );

app.get("/auth/facebook", passport.authenticate("facebook"));

app.get(
    "/auth/facebook/callback",
    passport.authenticate("facebook", { failureRedirect: "/",successRedirect: "/profile" }),
    function(req, res) {
      console.log("req", req.user)
      user = req.user;
      res.send({user:req.user});
    }
)

app.get("/profile", (req, res) => {
    res.redirect("/profile.html");
});

app.get('/graph/photos', function (req, res) {
    var hsResponse = request({
        url: 'https://graph.facebook.com/me/photos',
        method: 'GET',
        qs: {
            "access_token": req.user.facebook.token
        },
    }, function (error, response, body) {
        res.setHeader('Content-Type', 'application/json');
        res.send(body);
    });
});

app.get("/facebook/profile",(req,res)=>{
    res.send(user);
})

app.engine('handlebars', exphbs());

app.set('view engine', 'handlebars');

app.use(express.static(path.join(__dirname, '../public/')));

const httpsOptions = {
    key: fs.readFileSync('./key.pem'),
    cert: fs.readFileSync('./cert.pem')
  }
  const server = https.createServer(httpsOptions, app).listen(3737, () => {
    console.log('server running at ' + 3737)
  })