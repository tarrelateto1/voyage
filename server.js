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
app.set('view engine', 'ejs');
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

ref.once("value", function (snapshot) {
  t2 = snapshot.val();
  
});

//download list user
var db = admin.database();
var t1;
var ref = db.ref("User");
ref.once("value", function (snapshot) {
  t1 = snapshot.val();
});


// เหมือนจะไม่ได้ใช้แล้ว
app.get('/test_load_img', function (req, res) {
  res.sendFile(__dirname + '/Design/load_img.html');
});
app.get('/test', function (req, res) {
  res.sendFile(__dirname + '/Design/index.html');
});
//register 
app.post('/register', function (req, res) {
  var ref = db.ref("User");
  var repeat_id = false;
  var keys = [];
  for (var k in t1) keys.push(k);
  console.log(keys);
  for (var i = 0; i < keys.length; i++) {
    if (keys[i] == req.body.user) {
      repeat_id = true
    }
  }
  if (!repeat_id) {
    var usersRef = ref.child(String(req.body.user));
    usersRef.update({
      "pass": String(req.body.pass),
      "status": "User"
    });
    console.log("success");
    ref.once("value", function (snapshot) {
      t1 = snapshot.val();
      console.log(t1);
    });
    res.redirect("/");
  } else {
    console.log("can't add")
    res.send('<html><head></head><body><script>alert("รหัสซ้ำ"); window.location.replace("/");</script></body></html>')
  }

});
//login
app.post('/login', function (req, res) {
  var t_user = String(req.body.user);
  var p_user = String(req.body.pass);
  var check_pass = false;
  var keys = [];
  for (var k in t1) keys.push(k);
  // console.log(keys);
  for (var i = 0; i < keys.length; i++) {
    if (keys[i] == t_user) {
      check_pass = true
    }
  }
  // console.log("pass");

  if (check_pass) {
    if (String(t1[t_user]["pass"]) == String(p_user) && String(t1[t_user]["status"]) == String("User")) {
      u.setuser(t_user);
      u.setpass(p_user);
      u.setstate("User");
      res.send('<html><head></head><body><script>alert("login success"); window.location.replace("/myblogger");</script></body></html>')
      //  res.redirect("/");
    } else {
      res.send('<html><head></head><body><script>alert("รหัสไม่ถูกต้อง"); window.location.replace("/");</script></body></html>')

    }

  } else {
    res.send('<html><head></head><body><script>alert("ไม่มี user ในระบบ"); window.location.replace("/");</script></body></html>')

    // res.redirect("/")
  }
});
app.get('/logout', function (req, res) {
  u.setuser(null);
  u.setpass(null);
  u.setstate("User");
  res.send('<html><head></head><body><script>alert("logout success"); window.location.replace("/");</script></body></html>')
});

app.post('/createblogger-sendfile', function (req, res) {
  console.log(req.body.title);
  console.log(req.body.ckeditor);
  var postsRef = db.ref("blogger");

  postsRef.push().set({
    "user": String(u.user),
    "title": String(req.body.title),
    "content": String(req.body.ckeditor)
  })
  ref.once("value", function (snapshot) {
    t2 = snapshot.val();
    
  });
  res.send('<html><head></head><body><script>alert("create blogger success"); window.location.replace("/");</script></body></html>')

});


//ส่วนที่แสดงผล
app.get('/', function (req, res) {
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
  if (u.user == null) {
    body += '<div id="includedContent"></div>';
  } else {
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
  var html = '';
  html += head;
  html += body;
  // res.send(html);
  res.render('index');

});
// Myblooger page
app.get('/myblogger', function (req, res) {
  // ส่วนใหม่
  var head = '';
  
  var html = '';
  html += head;
  html += body;
  // res.send(html);
  var data = {name:String(u.user)};

  res.render("myblog",{t2:t2,key:data});
});

// create blogger page

app.get('/createblogger', function (req, res) {
  res.render('create_blog');
});

app.get('/TotalBlogger', function (req, res) {
  var head = '';
  head += ' <!DOCTYPE html>';
  head += '<html lang="en">';
  head += ' <head>';
  head += '    <title>Funder &mdash; Colorlib Website Template</title>';
  head += '   <meta charset="utf-8">';
  head += '  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">';

  head += '  <link href="https://fonts.googleapis.com/css?family=Oswald:400,700|Work+Sans:300,400,700" rel="stylesheet">';
  head += '  <link rel="stylesheet" href="fonts/icomoon/style.css">';

  head += ' <link rel="stylesheet" href="css/bootstrap.min.css">';
  head += '  <link rel="stylesheet" href="css/magnific-popup.css">';
  head += '  <link rel="stylesheet" href="css/jquery-ui.css">';
  head += '  <link rel="stylesheet" href="css/owl.carousel.min.css">';
  head += ' <link rel="stylesheet" href="css/owl.theme.default.min.css">';
  head += ' <link rel="stylesheet" href="css/bootstrap-datepicker.css">';
  head += ' <link rel="stylesheet" href="css/animate.css">';

  head += ' <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/mediaelement@4.2.7/build/mediaelementplayer.min.css">';



  head += ' <link rel="stylesheet" href="fonts/flaticon/font/flaticon.css">';

  head += '  <link rel="stylesheet" href="css/aos.css">';

  head += '  <link rel="stylesheet" href="css/style.css">';

  head += '</head>';
  
  var body = '';

  body += '<body style="background-image: url("images / bg.jpg");">';

  body += '<div class="site-wrap">';



  body += '  <div class="site-mobile-menu">';
  body += '   <div class="site-mobile-menu-header">';
  body += '  <div class="site-mobile-menu-close mt-3">';
  body += '    <span class="icon-close2 js-menu-toggle"></span>';
  body += '  </div>';
  body += ' </div>';
  body += '  <div class="site-mobile-menu-body"></div>';
  body += '  </div>';


  body += '  <div class="site-navbar-wrap js-site-navbar bg-white">';

  body += '  <div class="container">';
  body += '   <div class="site-navbar bg-light">';
  body += '    <div class="row align-items-center">';
  body += '     <div class="col-2">';
  body += '     <h2 class="mb-0 site-logo"><a href="index.html" class="font-weight-bold">VOYAGE</a></h2>';
  body += '    </div>';
  body += '    <div class="col-10">';
  body += '      <nav class="site-navigation text-right" role="navigation">';
  body += '         <div class="container">';
  body += '          <div class="d-inline-block d-lg-none ml-md-0 mr-auto py-3"><a href="#" class="site-menu-toggle js-menu-toggle text-black"><span class="icon-menu h3"></span></a></div>';

  body += '         <ul class="site-menu js-clone-nav d-none d-lg-block">';
  body += '               <li class="active"><a href="index.html">Home</a></li>';
  body += '<li class="has-children">';
  body += '                   <a href="insurance.html">Region</a>';
  body += '                <ul class="dropdown arrow-top">';
  body += '                 <li class="has-children">';
  body += '<a href="#">North</a>';
  body += '                <ul class="dropdown">';
  body += '<li><a href="insurance.html">Home Insurance</a></li>';
  body += '                           <li><a href="insurance.html">Auto Insurance</a></li>';
  body += '                            <li><a href="insurance.html">Travel Insurance</a></li>';
  body += '                        </ul>';
  body += '                    </li>';

  body += '             <li class="has-children">';
  body += '                    <a href="#">North East</a>';
  body += '                    <ul class="dropdown">';
  body += '                     <li><a href="insurance.html">Home Insurance</a></li>';
  body += '                     <li><a href="insurance.html">Auto Insurance</a></li>';
  body += '                     <li><a href="insurance.html">Travel Insurance</a></li>';
  body += '                  </ul>';
  body += '                  </li>';
  body += '       <li class="has-children">';
  body += '            <a href="#">Central</a>';
  body += '              <ul class="dropdown">';
  body += '<li><a href="insurance.html">Home Insurance</a></li>';
  body += '                <li><a href="insurance.html">Auto Insurance</a></li>';
  body += '<li><a href="insurance.html">Travel Insurance</a></li>';
  body += '        </ul>';
  body += '          </li>';
  body += '           <li class="has-children">';
  body += '<a href="#">Southern</a>';
  body += '                <ul class="dropdown">';
  body += '     <li><a href="insurance.html">Home Insurance</a></li>';
  body += '         <li><a href="insurance.html">Auto Insurance</a></li>';
  body += '          <li><a href="insurance.html">Travel Insurance</a></li>';
  body += '      </ul>';
  body += '     </li>';

  body += '    </ul>';
  body += '      </li>';
  body += '      <li><a href="services.html">Services</a></li>';
  body += '      <li><a href="blog.html">Blog</a></li>';
  body += '<li><a href="about.html">About</a></li>';
  body += '      <li><a href="contact.html">Contact</a></li>';
  body += '     <li><a href="contact.html"><span class="d-inline-block p-3 bg-primary text-white btn btn-primary">Get A Quote</span></a></li>';
  body += '    </ul>';
  body += '         </div>';
  body += '        </nav>';
  body += '      </div>';
  body += '</div>';
  body += '     </div>';
  body += '    </div>';
  body += '   </div>';
  // หัวข้อ
  body += '<div class="site-section">';
  body += '<div class="container">';
  body += '<div class="row mb-5">';
  body += '<div class="col-12"><center><h2 class="text-uppercase">Blogger</h2></center></div>';
  body += ' </div>';
  body += ' </div>';
  body += '  </div>';


  for (var k in t2) {

    body += '  <div class="col-md-12 col-lg-12 mb-5">';
    body += '   <div class="media-image">';
    body += '   <div class="media-image-body">';
    body += '  <h2 class="font-secondary text-uppercase"><a href ="/showblogger/' + String(k) + '">' + String(t2[String(k)]["title"]) + '</a></h2>';
    body += '     </div>';
    body += '   </div>';
    body += '</div>';


  }

  body += '<div class="py-5 bg-primary">';
  body += '<div class="container">';
  body += '  <div class="row align-items-center">';
  body += ' <div class="col-md-6 text-center text-md-left mb-3 mb-md-0">';
  body += '    <h2 class="text-uppercase text-white mb-0">Small Business Insurance Company</h2>';
  body += '   </div>';
  body += '  <div class="col-md-3 ml-auto text-center text-md-left">';
  body += '   <a href="#" class="btn btn-bg-primary d-inline-block d-md-block font-secondary text-uppercase">Contact Us</a>';
  body += '   </div>';
  body += ' </div>';
  body += '</div>';
  body += '</div>';
  body += '<footer class="site-footer">';
  body += ' <div class="container">';


  body += ' <div class="row">';
  body += '  <div class="col-md-4">';
  body += '    <h3 class="footer-heading mb-4 text-white">About</h3>';
  body += '   <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Repellat quos rem ullam, placeat amet.</p>';
  body += '  <p><a href="#" class="btn btn-primary rounded text-white px-4">Read More</a></p>';
  body += '  </div>';
  body += ' <div class="col-md-5 ml-auto">';
  body += '  <div class="row">';
  body += '    <div class="col-md-6">';
  body += '     <h3 class="footer-heading mb-4 text-white">Quick Menu</h3>';
  body += '      <ul class="list-unstyled">';
  body += '     <li><a href="#">Home</a></li>';
  body += '        <li><a href="#">About</a></li>';
  body += '        <li><a href="#">Insurance</a></li>';
  body += '        <li><a href="#">Blog</a></li>';
  body += '       <li><a href="#">Contacts</a></li>';
  body += '       <li><a href="#">Privacy</a></li>';
  body += '     </ul>';
  body += '    </div>';
  body += '    <div class="col-md-6">';
  body += '    <h3 class="footer-heading mb-4 text-white">Insurance</h3>';
  body += '      <ul class="list-unstyled">';
  body += '        <li><a href="#">Home Insurance</a></li>';
  body += '              <li><a href="#">Auto Insurance</a></li>';
  body += '             <li><a href="#">Travel Insurance</a></li>';
  body += '            <li><a href="#">Business Insurance</a></li>';
  body += '</ul>';
  body += '</div>';
  body += '</div>';
  body += '   </div>';


  body += '  <div class="col-md-2">';
  body += '    <div class="col-md-12"><h3 class="footer-heading mb-4 text-white">Social Icons</h3></div>';
  body += '    <div class="col-md-12">';
  body += '<p>';
  body += '      <a href="#" class="pb-2 pr-2 pl-0"><span class="icon-facebook"></span></a>';
  body += '      <a href="#" class="p-2"><span class="icon-twitter"></span></a>';
  body += '      <a href="#" class="p-2"><span class="icon-instagram"></span></a>';
  body += '<a href="#" class="p-2"><span class="icon-vimeo"></span></a>';

  body += '     </p>';
  body += '    </div>';
  body += '  </div>';
  body += '  </div>';
  body += '<div class="row pt-5 mt-5 text-center">';
  body += '<div class="col-md-12">';
  body += '    <p>';
  body += '     Copyright &copy; <script>document.write(new Date().getFullYear());</script> All Rights Reserved | This template is made with <i class="icon-heart text-danger" aria-hidden="true"></i> by <a href="https://colorlib.com" target="_blank" >Colorlib</a>';
  body += '   </p>';
  body += '   </div>';

  body += ' </div>';
  body += ' </div>';
  body += '</footer>';
  body += '</div>';

  body += '<script src="js/jquery-3.3.1.min.js"></script>';
  body += '<script src="js/jquery-migrate-3.0.1.min.js"></script>';
  body += '<script src="js/jquery-ui.js"></script>';
  body += '<script src="js/popper.min.js"></script>';
  body += '<script src="js/bootstrap.min.js"></script>';
  body += '<script src="js/owl.carousel.min.js"></script>';
  body += '<script src="js/jquery.stellar.min.js"></script>';
  body += '<script src="js/jquery.countdown.min.js"></script>';
  body += '<script src="js/jquery.magnific-popup.min.js"></script>';
  body += '<script src="js/bootstrap-datepicker.min.js"></script>';
  body += '<script src="js/aos.js"></script>';

  body += '<script src="js/main.js"></script>';

  body += '</body>';
  body += '</html>';
  var html = '';
  html += head;
  html += body;
  res.send(html);
  // res.render("Totalblog",{t2:t2});
});

app.get('/showblogger/:name', function (req, res) {
  keyblogger = String(req.params.name);
  var s = String(req.params.name);
 var data = {name:s};
  res.render("blog",{t2:t2,key:data});
});
var keyblogger ;
app.get('/createcomment-sendfile',function(req,res){
  // console.log(req.body.title);
  console.log(req.body.ckeditor);
  console.log(keyblogger);
  var postsRef = db.ref("blogger/"+keyblogger+"/comment");

  postsRef.push().set({
    "user": String(u.user),
    "content": String(req.body.ckeditor)
  })

  ref.once("value", function (snapshot) {
    t2 = snapshot.val();
    
  });
  
  res.send('<html><head></head><body><script>alert("create comment success"); window.location.replace("/");</script></body></html>')

});
app.listen(8081);
