var express = require('express');
var app = express();

var admin = require("firebase-admin");
var firebase = require("firebase");

var serviceAccount = require("./firebase/serviceAccountKey_firebase.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://voyage-cd39b.firebaseio.com"
});


app.get('/',function(req,res) {
    res.sendFile(__dirname+'/Design/load_img.html');
  });


app.listen(8081);

