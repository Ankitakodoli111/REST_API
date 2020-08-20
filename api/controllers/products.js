const mongoose = require('mongoose');
const Products = require('../models/product');


exports.products_getall =function(req, res) {
  Products.find({})
    .select('name price _id productImage')
    .exec()
    .then(results => {
      const response = {
        count: results.length,
        products: results.map(result => {
          return {
            name: result.name,
            price: result.price,
            productImage:result.productImage,
            id: result._id,
            request: {
              type: 'GET',
              url: "http://localhost:3000/products/" + result._id
            }
          };
        })
      };
      res.status(200).json(response);
    })
    .catch(err => {
      res.status(500).json({
        message: err
      });
    });
}

exports.products_add=function(req, res) {
  console.log(req.file);
  const newproduct = new Products({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
    productImage:req.file.path
  });
  newproduct
  .save()
  .then(result =>{
    res.status(200).json({
      message:"Created successfully",
      product:{
        name:result.name,
        price:result.price,
        productImage:result.productImage,
        id:result._id,
        request:{
          type:"GET",
          url:"http://localhost:3000/products/" + result._id
        }
      }
    });
  })
  .catch(err =>{
    res.status(500).json({
      message:err
    });
  });
}

exports.product_getbyid=function(req, res) {
  const id = req.params.productid;
  Products.findById(id)
    .select('name price _id')
    .exec()
    .then(pro => {
      if (pro) {
        const result={
          prod:pro,
          request:{
            type:"GET",
            url:"http://localhost:3000/products"
          }
        }
        res.status(200).json(result);
      } else {
        res.status(404).json({
          message: "No valid data entry found for thr ID"
        });
      }
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    })
}

exports.products_deletebyid=function(req, res) {
  const id = req.params.productid;
  Products.deleteOne({
      _id: id
    })
    .then(result => {
      res.status(200).json({
        message: "Delete successfully",
        request:{
          type:"GET",
          url:"http://localhost:3000/products"
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        errormessage: err
      });
    });
}

exports.products_patch=function(req, res) {
  const id = req.params.productid;
  Products.updateOne({_id: id}, {$set: req.body}, function(err, result) {
    if (!err) {
      res.status(200).json({
        message:"Update successfully",
        request:{
          type:"GET",
          url:"http://localhost:3000/products/" +id
        }
      });
    } else {
      res.send(err);
    }
  });
}
