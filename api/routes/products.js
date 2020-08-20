const express = require('express');
const mongoose = require('mongoose');
const multer=require('multer');
const checkAuth=require('../middleware/check-auth');

const storage= multer.diskStorage({
  destination: function(req,file,cb){
    cb(null,'./uploads/');
  },
  filename:function(req,file,cb){
    cb(null, file.originalname);
  }
});
const filefilter=(req,res,cb) =>{
  //accepting a file
  if(file.mimetype === 'image/png' || file.mimetype ==='image/jpg' ||file.mimetype ==='image/jpeg'){
    cb(null,true);
  }else{
    // rejecting a file
    cb(null,false);
  }
}

const upload=multer({
  storage:storage,
  filefilter:filefilter
  // limits:{
  //   fileSize:1024*1024*5
  // }
});

const app = express();
const Products = require('../models/product');
const ProductsController=require('../controllers/products');

// API for /products route
app.route("/")
  .get(ProductsController.products_getall)

  .post(upload.single('productImage'),checkAuth,ProductsController.products_add);

// API for /products/productsID route
app.route("/:productid")
  .get(ProductsController.product_getbyid)
  .delete(checkAuth,ProductsController.products_deletebyid)
  .patch(checkAuth,ProductsController.products_patch);

module.exports = app;
