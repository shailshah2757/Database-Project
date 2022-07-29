var express = require('express');
var router = express.Router();
var mysql=require('mysql')

var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'admin'
});
 
connection.connect(function(err){
  if(!err)
  {
    console.log("Database connected")
  }
  else
  {
    console.log("Error connecting database")
  }
});
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('login');
});

// router.get('/table', function(req, res, next) {
//   res.render('table-basic', { title: 'Express' });
// });

router.get('/form', function(req, res, next) {
  res.render('admin');
});

router.get('/dashboard', function(req, res, next) {
  if(req.session.mysess){
    var username = req.session.mysess;
    var password = req.session.mysess;
    res.render('dashboard', {myvalue : username, myvalue1 : password});
  }else{
    res.redirect('/login');
  }
})

router.get('/logout', function(req,res,next) {
  req.session.destroy(function(err) {
    res.redirect('/login');
  })
})

router.get('/profile', function(req,res,next) {
  res.render('profile');
})

router.get('/login', function(req,res,next) {
  res.render('login');
})

router.post('/login', function(req,res,next) {
  var my1 = req.body.txt1;
  console.log(my1);

  req.session.mysess = my1;
  console.log("Session value is " + req.session.mysess);
  res.redirect('/dashboard');
})

router.get('/form1', function(req,res,next) {
  res.render('category');
})

router.get('/form2', function(req,res) {
  res.render('user');
})

router.get('/form3', function(req,res) {
  res.render('product');
})

// router.get('/admin', function(req,res,next) {
//   res.render('admin');
// })

router.post('/form3', function(req,res,next) {
  const fileobj = req.files.image;
  const filename = req.files.image.name;
  const mybodydata3 = {
    product_name: req.body.product_name,
    product_price: req.body.product_price,
    product_details: req.body.product_details,
    product_image: req.files.image.name,
    category_id: req.body.cat_id
  }
  connection.query("insert into tbl_product set ?", [mybodydata3], function(err) {
    if(err) throw err;
    fileobj.mv('public/images/' +filename, function(err) {
      res.redirect('/form3')
    });
      // res.redirect('/form3');
  })
})

router.post('/form2', function(req,res,next) {
  console.log(req.body);
  const mybodydata2 = {
    user_name: req.body.user_name,
    user_gender: req.body.user_gender,
    user_email: req.body.user_email,
    user_password: req.body.user_password,
    user_address: req.body.user_address
  }
  connection.query("insert into tbl_user set ?", mybodydata2, function(err, result) {
    if(err) throw err;
    res.redirect('/form2');
  })
})

router.post('/form1', function(req,res,next) {
  console.log(req.body);
  const mybodydata1 = {
    category_name: req.body.category_name
  }
  connection.query("insert into tbl_category set ?", mybodydata1, function(err, result) {
    if(err) throw err;
    res.redirect('/form1');
  })
})

router.post('/form',function(req,res){
  console.log(req.body);
  const mybodydata={
    admin_name:req.body.admin_name,
    admin_email:req.body.admin_email,
    admin_password:req.body.admin_password
  }
  connection.query("insert into tbl_admin set ?",mybodydata,function(err,result){
    if(err) throw err;
    res.redirect('/form')
  })
  })

  router.get('/display3', function(req,res,next) {
    connection.query("select * from tbl_product", function(err, db_rows3) {
      if(err) throw err;
      console.log(db_rows3);
      res.render('display-product-data', {db_rows_array3:db_rows3});
    })
  })

  router.get('/display2', function(req,res,next) {
    connection.query("select * from tbl_user", function(err, db_rows2) {
      if(err) throw err;
      console.log(db_rows2);
      res.render('display-user-data', {db_rows_array2:db_rows2});
    })
  })

  router.get('/display1', function(req,res,next) {
    connection.query("select * from tbl_category", function(err, db_rows1) {
      if(err) throw err;
      console.log(db_rows1);
      res.render('display-category-data',{db_rows_array1:db_rows1});
    })
  })

  router.get('/display',function(req,res,next){
    connection.query("select * from tbl_admin",function(err,db_rows){
      if(err) throw err;
      console.log(db_rows)
      res.render('display-admin-data',{db_rows_array:db_rows})
    })
    })

    router.get('/delete3/:id', function(req,res) {
      var deleteid = req.params.id;
      console.log("Delete id is: " + deleteid);
      connection.query("delete from tbl_product where product_id = ?", [deleteid], function(err, db_rows3) {
        if(err) throw err;
        console.log(db_rows3);
        console.log("Record deleted");
        res.redirect('/display3');
      })
    })

    router.get('/delete2/:id', function(req,res) {
      var deleteid = req.params.id;
      console.log("Delete id is: " + deleteid);
      connection.query("delete from tbl_user where user_id = ?", [deleteid], function(err, db_rows2){
        if(err) throw err;
        console.log(db_rows2);
        console.log("Record deleted");
        res.redirect('/display2');
      })
    })

    router.get('/delete1/:id', function(req,res) {
      var deleteid = req.params.id;
      console.log("Delete id is: " + deleteid);
      connection.query("delete from tbl_category where category_id = ?", [deleteid], function(err, db_rows1){
        if(err) throw err;
        console.log(db_rows1);
        console.log("Record deleted");
        res.redirect('/display1');
      })
    })

    router.get('/delete/:id',function(req,res){
      var deleteid = req.params.id;
      console.log("Delete id is " + deleteid);
      connection.query("delete from tbl_admin where admin_id = ?",
      [deleteid],function(err,db_rows)
      {
        if(err) throw err;
        console.log(db_rows)
        console.log("Record Deleted")
        res.redirect('/display');
      })
    })  

    router.get('/show3/:id', function(req,res) {
      var showid = req.params.id;
      console.log("Show id is: " +showid)
        connection.query("select * from tbl_product where product_id = ?", [showid], function(err, db_rows3) {
          console.log(db_rows3);
          if(err) throw err;
          res.render("show-product-data", {db_rows_array3:db_rows3});
        })
    })

    router.get('/show2/:id',function(req,res){
      var showid=req.params.id;
      console.log("Show id is " +showid)
    
      connection.query("select * from tbl_user where user_id= ?",[showid],
      function(err,db_rows2)
      {
        console.log(db_rows2);
        if(err) throw err;
        res.render("show-user-data",{db_rows_array2:db_rows2});
      })
    })   

    router.get('/show1/:id',function(req,res){
      var showid=req.params.id;
      console.log("Show id is " +showid)
    
      connection.query("select * from tbl_category where category_id= ?",[showid],
      function(err,db_rows1)
      {
        console.log(db_rows1);
        if(err) throw err;
        res.render("show-category-data",{db_rows_array1:db_rows1});
      })
    })   

    router.get('/show/:id',function(req,res){
      var showid=req.params.id;
      console.log("Show id is " +showid)
    
      connection.query("select * from tbl_admin where admin_id= ?",[showid],
      function(err,db_rows)
      {
        console.log(db_rows);
        if(err) throw err;
        res.render("show-admin-data",{db_rows_array:db_rows});
      })
    })   

    router.get('/edit3/:id', function(req,res) {
      console.log("Edit id is: "+ req.params.id);
      var product_id = req.params.id;
      connection.query("select * from tbl_product where product_id = ?", [product_id], function(err, db_rows3) {
        if(err) throw err;
        console.log(db_rows3)
        res.render("edit-product-data", {db_rows_array3:db_rows3});
      })
    })

    router.get('/edit2/:id', function(req,res) {
      console.log("Edit id is: ", req.params.id);
      var user_id = req.params.id;
      connection.query("select * from tbl_user where user_id = ?", [user_id], function(err, db_rows2) {
        if(err) throw err;
        console.log(db_rows2)
        res.render('edit-user-data',{db_rows_array2:db_rows2});
      })
    })

    router.get('/edit1/:id', function(req,res) {
      console.log("Edit id is: ", req.params.id);
      var category_id = req.params.id;
      connection.query("select * from tbl_category where category_id = ?", [category_id], function(err, db_rows1) {
        if(err) throw err;
        console.log(db_rows1)
        res.render('edit-category-data',{db_rows_array1:db_rows1});
      })
    })

    router.get('/edit/:id',function(req,res){
      console.log("Edit id is :",req.params.id)
      var admin_id=req.params.id;
      connection.query("select * from tbl_admin where admin_id = ?",[admin_id],function(err,db_rows){
        if(err) throw err;
        console.log(db_rows)
        res.render('edit-admin-data',{db_rows_array:db_rows});
        
      })
    });

    router.post('/edit3/:id', function(req,res) {
      console.log("Edit id is:" + req.params.id) ;

      var product_id = req.params.id;

      var product_name = req.body.product_name;
      var product_price = req.body.product_price;
      var product_details = req.body.product_details;
      var product_image = req.body.image;
      var category_id = req.body.cat_id;

      connection.query("update tbl_product set product_name = ? , product_price = ? , product_details = ? , product_image = ? , category_id = ? where product_id = ?", [product_name, product_price, product_details, product_image, category_id, product_id], function(err, respond) {
        if(err) throw err;
        res.redirect('/display3');
      })
    })

    router.post('/edit2/:id', function(req,res) {
      console.log("Edit id is ", + req.params.id);

      var user_id = req.params.id;

      var user_name = req.body.user_name;
      var user_gender = req.body.user_gender;
      var user_email = req.body.user_email;
      var user_password = req.body.user_password;
      var user_address = req.body.user_address;

      connection.query("update tbl_user set user_name = ? , user_gender = ? , user_email = ? , user_password = ? , user_address = ? where user_id = ?", [user_name, user_gender, user_email, user_password, user_address, user_id], function(err, respond) {
        if(err) throw err;
        res.redirect('/display2');
      })
    })

    router.post('/edit1/:id', function(req,res) {
      console.log("Edit id is ", + req.params.id);

      var category_id = req.params.id;

      var category_name = req.body.category_name;

      connection.query("update tbl_category set category_name = ? where category_id = ?", [category_name, category_id], function(err, respond) {
        if(err) throw err;
        res.redirect('/display1');
      })
    })

    router.post('/edit/:id', function(req,res,next){
      console.log("Edit id is ",+req.params.id);
    
      var admin_id=req.params.id;
      
      var admin_name=req.body.admin_name;
      var admin_email=req.body.admin_email;
      var admin_password=req.body.admin_password;
      
      connection.query("update tbl_admin set admin_name = ?, admin_email = ?, admin_password = ? where admin_id=?",
      [admin_name,admin_email,admin_password,admin_id],function(err,respond){
        if(err) throw err;
        res.redirect('/display');
      });
    });
    
    
module.exports = router;
