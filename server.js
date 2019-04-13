var express = require('express');
var app = express();

var admin = require("firebase-admin");
var firebase = require("firebase");

var serviceAccount = require("./firebase/serviceAccountKey_firebase.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://voyage-cd39b.firebaseio.com"
});

// เหมือนจะไม่ได้ใช้แล้ว
app.get('/test_load_img',function(req,res) {
    res.sendFile(__dirname+'/Design/load_img.html');
  });



app.listen(8081);
