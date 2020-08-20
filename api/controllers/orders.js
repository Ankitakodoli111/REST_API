const Order=require('../models/order');
const Product=require('../models/product');
const mongoose=require('mongoose');

exports.orders_get_all=function(req,res){
  Order.find({})
  .select('_id quantity product')
  .populate('product','name')
  .then(results =>{
    res.status(200).json({
      count:results.length,
      order:results.map(result =>{
        return{
          _id:result._id,
          quantity:result.quantity,
          product:result.product,
          request:{
            type:"GET",
          url:"http://localhost:3000/orders/"+result._id
        }
      }
    })
    });
  })
  .catch(err =>{
    res.status(500).json({
      message:err
    });
  });
}

exports.orders_create_order=function(req,res){
  Product.findById(req.body.productID)
  .then(product =>{
    if(!product){
     return  res.status(500).json({
          message:"Product ID not found"
        });
    }
    const order= new Order({
      _id:mongoose.Types.ObjectId(),
      quantity:req.body.quantity,
      product:req.body.productID
    });
    return order.save();
  })
  .then(result => {
      res.status(200).json({
        message:"Order created successfully",
        order:{
          _id:result._id,
          product:result.product,
          quantity:result.quantity
        },
        request:{
          type:"GET",
          url:"http://localhost:3000/orders/"+result._id
        }
      });
    })
    .catch(err =>{
      res.status(500).json(
        {
          message:"err"
        }
      )
    });
}

exports.orders_getbyid =function(req,res){
  Order.findById(req.params.orderID)
  .populate('product')
  .exec()
  .then(order => {
    if(!order){
      res.status(404).json({
        message:"order not found"
      });
    }
    res.status(500).json({
      order:order,
      request:{
        type:"GET",
        url:"http://localhost:3000/orders"
      }
    })
  })
  .catch(err=>{
    res.status(500).json({
      message:'order not found',
      error:err
    })
  });
}

exports.orders_delete=function(req,res){
  Order.deleteOne({_id:req.params.orderID})
  .exec()
  .then(result=>{
    res.status(200).json({
      message:"Order deleted",
      request:{
        type:"GET",
        url:"http://localhost:3000/orders"
      }
    });
  })
  .catch(err =>{
    res.status(500).json({
      message:'The order for mentioned ID is not present',
      error:err
    })
  });

}
