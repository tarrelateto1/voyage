//กำหนด api ที่ใช้
var express = require('express');
var app = express();
var admin = require("firebase-admin");
var path = require('path');
var body = require('body-parser');

// class ที่ทำขึ้น
var user = require('./class/User.js');
// test
var u = new user();
u.setuser("tar");
u.setpass("123");
u.setstate("user");

console.log(u.user);

// set api
app.use(express.static(path.join(__dirname, 'public')));
app.use(body.urlencoded({ extended: false }));



// เชื่อมกับ firebase
var serviceAccount = require("./firebase/serviceAccountKey_firebase.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://voyage-cd39b.firebaseio.com"
});

// เหมือนจะไม่ได้ใช้แล้ว
app.get('/test_load_img',function(req,res) {
    res.sendFile(__dirname+'/Design/load_img.html');
  });
app.get('/test',function(req,res){
  res.sendFile(__dirname+'/Design/index.html');
});


app.get('/',function(req,res){
  //กำหนด ส่วน head ที่ดึงข้อมูลมา
  var head = '';
  head += '<!DOCTYPE html>'
  head += '<html>';
  head += '<head>';
  head += ' <meta charset="UTF-8">';
  head += ' </head>'
  head += '  <meta name="viewport" content="width=device-width, initial-scale=1">'
  head += '  <link rel="stylesheet" href="./css/home.css">';
  head += '  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.7/css/bootstrap.min.css">'
  head += '<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>'
  head += '<script>$(function(){$("#includedContent").load("./html/home.html");});</script>'

  head += ' </header>';
  // ส่วนของ body
  var body = '';
  body += '<body>';
//ส่วนที่สามารถแก้ไขได้
  body += '<div id="includedContent"></div>'

//ส่วนท้ายของ body
  body += '<script src="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.7/js/bootstrap.min.js"></script>'
  body += '<script rel="stylesheet" src="./js/popupsign.js"></script>'
  body += '</body>';
  body += '</html>';
  var html ='';
  html += head;
  html += body;
  res.send(html);
});


app.listen(8081);
