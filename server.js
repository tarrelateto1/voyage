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




// set api
app.use(express.static(path.join(__dirname, 'public')));
app.use(body.urlencoded({ extended: false }));



// เชื่อมกับ firebase
var serviceAccount = require("./firebase/serviceAccountKey_firebase.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://voyage-cd39b.firebaseio.com"
});
// test blogger
var db = admin.database();
var ref = db.ref("blogger");
var t2;
ref.once("value", function(snapshot) {
  t2 = snapshot.val();
  console.log("begin");
  // console.log(snapshot)
  console.log("."+snapshot.val())
  console.log("download success");
  console.log("show data");
console.log(t2["a1"]["user"]);
console.log(Object.keys(t2["a1"]["comment"]))
var test = Object.keys(t2)
console.log(Object.keys(t2)[0]);
console.log(test[1]);
});


//download list user
var db = admin.database();
var t1;
var ref = db.ref("User");
ref.once("value", function(snapshot) {
  t1 = snapshot.val();
});


// เหมือนจะไม่ได้ใช้แล้ว
app.get('/test_load_img',function(req,res) {
    res.sendFile(__dirname+'/Design/load_img.html');
  });
app.get('/test',function(req,res){
  res.sendFile(__dirname+'/Design/index.html');
});
//register 
app.post('/register',function(req,res){
  var ref = db.ref("User");
  var repeat_id = false;
  var keys = [];
  for (var k in t1 )keys.push(k);
  console.log(keys);
  for (var i = 0 ; i<keys.length;i++){
    if(keys[i]==req.body.user){
      repeat_id = true
    }
  }
  if(!repeat_id){
    var usersRef = ref.child(String(req.body.user));
   usersRef.update({
   "pass": String(req.body.pass),
   "status" : "User"
 });
console.log("success");
ref.once("value", function(snapshot) {
  t1 = snapshot.val();
   console.log(t1);
});
res.redirect("/");
  }else{
    console.log("can't add")
    res.send('<html><head></head><body><script>alert("รหัสซ้ำ"); window.location.replace("/");</script></body></html>')
  }
  
});
//login
app.post('/login',function(req,res){
  var t_user = String(req.body.user);
    var p_user = String(req.body.pass);
    var check_pass = false;
    var keys = [];
    for (var k in t1 )keys.push(k);
    // console.log(keys);
    for (var i = 0 ; i<keys.length;i++){
      if(keys[i]==t_user){
       check_pass = true
      }
    }
    // console.log("pass");
    
    if(check_pass){
    if(String(t1[t_user]["pass"]) == String(p_user) && String(t1[t_user]["status"]) == String("User")){
      u.setuser(t_user);
      u.setpass(p_user);
     u.setstate("User");
     res.send('<html><head></head><body><script>alert("login success"); window.location.replace("/");</script></body></html>')
    //  res.redirect("/");
   }else{
    res.send('<html><head></head><body><script>alert("รหัสไม่ถูกต้อง"); window.location.replace("/");</script></body></html>')

   }

  }else{
     res.send('<html><head></head><body><script>alert("ไม่มี user ในระบบ"); window.location.replace("/");</script></body></html>')

    // res.redirect("/")
  }
});
app.get('/logout',function(req,res){
u.setuser(null);
u.setpass(null);
u.setstate("User");
res.send('<html><head></head><body><script>alert("logout success"); window.location.replace("/");</script></body></html>')
});


//ส่วนที่แสดงผล
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
if(u.user ==null){
  body += '<div id="includedContent"></div>';
}else {
  body += '<a href="logout"> <button type="button">Click Me!</button> </a>  ';
}
  // body += '<div id="includedContent"></div>';
  // body += '<form><input type="button" value="Put Your Text Here" onclick="window.location.href="http://www.hyperlinkcode.com/button-links.php" /></form>';

//ส่วนท้ายของ body
  body += '<script src="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.7/js/bootstrap.min.js"></script>';
  body += '<script rel="stylesheet" src="./js/popupsign.js"></script>';
  body += '</body>';
  body += '</html>';
  var html ='';
  html += head;
  html += body;
  res.send(html);
});


app.listen(8081);
