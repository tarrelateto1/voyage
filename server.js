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
// app.use(express.static("/"))
app.set('view engine','ejs');
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
console.log(Object.keys(t2).length);
console.log(test[1]);
console.log("test for");
var keys=[]
for (var k in t2 ){
  // keys.push(k);  
  // console.log(t2[String(k)]["user"]);
  if(t2[String(k)]["user"] == "tar"){
    console.log(t2[String(k)]["title"]); 
  }
}
console.log("test log");
for (var i = 0 ; i<keys.length;i++){
  // if(keys[i]=="por"){
  //   console.log("user ");
  // }
  console.log(t2[String(keys[i])]["user"]);
  
}
//use in create blogger
console.log("test push");

// var postsRef = db.ref("blogger");

// postsRef.push().set({
//   "user":"jirawat",
//   "title":"koko",
//   "content":"jer koko"
// })


// ref = db.ref("blogger");

// var postsRef = ref

// var newPostRef = postsRef.push();
// newPostRef.set({
//   author: "gracehop",
//   title: "Announcing COBOL, a New Programming Language"
// });

// // we can also chain the two calls together
// postsRef.push().set({
//   author: "alanisawesome",
//   title: "The Turing Machine"
// });
// console.log("success");

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

app.post('/createblogger-sendfile',function(req,res){
  console.log(req.body.title);
  console.log(req.body.content);
  var postsRef = db.ref("blogger");

postsRef.push().set({
  "user":String(u.user),
  "title":String(req.body.title),
  "content":String(req.body.content)
})
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
  body += '<a href="myblogger" > <button type ="button">Myblogger</button></a><br>'
  body += '<a href="logout"> <button type="button">Logout</button> </a>';
  
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
  // res.send(html);
  res.render('index');

});
// Myblooger page
app.get('/myblogger',function(req,res){
  var head = '';
  head += '<!DOCTYPE html>'
  head += '<html>';
  head += '<head>';
  head += ' <meta charset="UTF-8">';
  head += ' </head>'
  head += '  <meta name="viewport" content="width=device-width, initial-scale=1">'
  head += '<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">  ';
  head += ' </header>'; 
  // ส่วนของ body
  var body = '';
  body += '<body>';
//ส่วนที่สามารถแก้ไขได้
  body += '<a href="myblogger > <button type ="button">Myblogger</button></a><br>'
  body += '<a href="logout"> <button type="button">Logout</button> </a>';
  body += '<div style="align:center;" > MY BLOGGER </div>'
  body +='<div class="card-deck">'

  for (var k in t2 ){
    // keys.push(k);  
    // console.log(t2[String(k)]["user"]);
    if(t2[String(k)]["user"] == String(u.user)){
      body += '<form method="POST"  name="blog">'
      // body += '<input type="hidden" name = "id" value = "id"><br>'
      // body += '<input type="hidden" name = "title" value = "title"><br>'
      // body += '<input type="submit" value = submit><br>'
      // body +='<div class="card" style="width: 18rem;">'
      body += ' <div class="card">'
      body += '  <img class="card-img-top" src="..." alt="Card image cap">'
      body += ' <div class="card-body">'
      body += '   <h5 class="card-title">Title '+String(t2[String(k)]["title"])+'</h5>'
      // body += '  <p class="card-text">This is a longer card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>'
      // body += '  <p class="card-text"><small class="text-muted">Last updated 3 mins ago</small></p>'
      body += '<button type ="button">ดูblogger</button>'
      body += ' </div>'
      body += ' </div>'
      //  body +='  </div>'
      
      body += '</form>'
    }
  }
  body +='  </div>'
body += '<br>'
body += '<div align="left"><a href="/createblogger"><button type = "button"> create blogger </button></a></div>'





//ส่วนท้ายของ body

body += '</body>';
body += '</html>';
var html ='';
html += head;
html += body;
res.send(html);
});

// create page
app.get('/createblogger',function(req,res){
 

var head = '';
  head += '<!DOCTYPE html>'
  head += '<html>';
  head += '<head>';
  head += ' <meta charset="UTF-8">';
  head += ' </head>'
  head += '  <meta name="viewport" content="width=device-width, initial-scale=1">'
  // head += '  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.0/css/bootstrap.min.css">  '
  // head += '<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">  ';
  //ของ CNC
  // head += '<script src="//cdn.ckeditor.com/4.11.4/full/ckeditor.js"></script>'
  //ของเก่า
  head += '<script rel="stylesheet" src="./ckeditor/ckeditor.js"></script>'
  // head += '  <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.0/js/bootstrap.min.js"></script>  '
  head += '  <link rel="stylesheet" href="./css/createblogger.css">';

  // head += '  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.7/css/bootstrap.min.css">'
  // head += '<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>'
  // head += ' <script src ="./ckeditor/ckeditor.js">'
  // head += '<script src="https://cdn.ckeditor.com/ckeditor5/12.0.0/classic/ckeditor.js"></script>  '
  //ของ node
  // head += '<script src="./node_modules/ckeditor/ckeditor.js"></script>  '
  head += '<style>div.b{width: 800px;}</style>'
  // head += '<script>$(function(){$("#includedContent").load("./html/createblogger.html");});</script>'
  head += ' </header>'; 
  // ส่วนของ body
  var body = '';
  body += '<body >';
//ส่วนที่สามารถแก้ไขได้
  // body += '<div id="includedContent"></div>';

  body += '<a href="myblogger > <button type ="button">Myblogger</button></a><br>'
  body += '<a href="logout"> <button type="button" id="logout">Logout</button> </a>';
  body += '<div style="align:center;" > Create BLOGGER </div>'
  body += '<form method="POST"  name="blog" action="/createblogger-sendfile">'
  body += '<h1> Title</h1><br>';
  body += '<input type= "text" name="title"><br>';
  body += '<h1>write Review</h1><br>'
  body += '<div class="b">'

  body += '<textarea name="content" class="ckeditor" ></textarea></div>'
//   body += '    <input type ="file" value ="upload" id="fileButton" hidden ="hidden"/> '
  body += '<button type="submit" id="myCheck" >submit</button>'
  body += '</form>'
// //เพิ่มปุ่ม
body += '<div class="box" hidden="hidden"><a class="button" href="#popup1" hidden="hidden" id="fileButton">Let me Pop up</a></div>'
body += '<div id="popup1" class="overlay">'
body += '<div class="popup">'
body += '<h2>Get link url file</h2>'
body += '	<a class="close" href="#">&times;</a>'
body += '	<div class="content">'
body += '          <progress value ="0" max = "100" id="uploader">0%</progress>'
body += '       <input type ="file" value ="upload" id="fileButton" />'
body += '        <p>URL:</p><br>'
body += '         <p id="getURL"></p>'

body += '	</div>'
body += '	</div>'
body += '</div>'
body += '<script>editor = CKEDITOR.replace("content"); '
body += 'editor.addCommand("mySimpleCommand", { '
  body += '   exec: function(edt) {'
    body += '     document.getElementById("fileButton").click();'
    body += '   }'
    body += '});'
    body += 'editor.ui.addButton("SuperButton", { '
      body += ' label: "Click me",'
      body += '  command: "mySimpleCommand",'
      body += '  toolbar: "insert",'
      body += '  icon: "https://avatars1.githubusercontent.com/u/5500999?v=2&s=16" '
      body += '});'
      body += '</script>'

//ส่วนท้ายของ body
body += '<script src="https://www.gstatic.com/firebasejs/5.9.4/firebase.js"></script>'
body += '<script>'
  // Initialize Firebase
  body += 'var config = {'
    body += '  apiKey: "AIzaSyDn41yOzZgCstOOyEy-HpmtVLfonw70_B0",'
    body += '   authDomain: "voyag'
    body += '   e-cd39b.firebaseapp.com",'
    body += '   databaseURL: "https://voyage-cd39b.firebaseio.com",'
    body += '    projectId: "voyage-cd39b",'
    body += '    storageBucket: "voyage-cd39b.appspot.com",'
    body += '  messagingSenderId: "449530269350"'
    body += ' };'
    body += ' firebase.initializeApp(config);'
  // ส่วนที่โหลดรูป
  body+= 'var uploader = document.getElementById("uploader");'

  body += ' var fileButton = document.getElementById("fileButton");'

  // Listenfor file selection
  body += ' fileButton.addEventListener("change",function(e){'
      //Get file
      body += '  var file = e.target.files[0];'

      //create a storage ref 
      body += '   var storageRef = firebase.storage().ref("images/"+file.name);'

      //Upload file
      body += '    var task = storageRef.put(file);'

      // Update progress bar
      body += '   task.on("state_changed",'
      
      body += '   function progress(snapshot){'
        body += '      var percentage = (snapshot.bytesTransferred/snapshot.totalBytes) * 100;'
        body += '       uploader.value = percentage;'
        body += '      },'
      body += '     function error(err){'

        body += '       },'
        body += '      function complete(){'
          body += '       var storageRef = firebase.storage().ref();'
          body += '   storageRef.child("images/"+file.name).getDownloadURL().then(function(url) {'
  // `url` is the download URL for 'images/stars.jpg'
  // This can be downloaded directly:
  body += ' var xhr = new XMLHttpRequest();'
  body += ' xhr.responseType = "blob";'
  body += '  xhr.onload = function(event) {'
    body += '    var blob = xhr.response;'
    body += '  };'
    body += ' xhr.open("GET", url);'
    body += '  xhr.send();'
  // Or inserted into an <img> element:
  body += '  var img = document.getElementById("myimg");'
  // document.getElementById("demo").innerHTML = url
  body += '  document.getElementById("getURL").value = url;'

  body += '  img.src = url;'
  body += ' }).catch(function(error) {'
  // Handle any errors'
  body += ' });'
     
  body += '    }'
  body += '     );'

      
  body += ' });'
  body +='</script>'

body += '</body>';
body += '</html>';
var html ='';
html += head;
html += body;
res.send(html);
});


app.listen(8081);
