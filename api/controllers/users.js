const mongoose=require('mongoose');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');

const User= require('../models/user');

exports.user_signup=(req,res,next)=>{
  User.find({email:req.body.email})
  .exec()
  .then(user=>{
    if(user.length >=1){
      return res.status(409).json({
        message:'mail exists'
      });
    }else{
      bcrypt.hash(req.body.password,10,(err,hash)=>{
        if(err){
          res.status(500).json({
            text:"Hashing connot be performed",
            message:err
          });
        }else{
          const newUser= new User({
            _id:mongoose.Types.ObjectId(),
            email:req.body.email,
            password:hash
          });
          newUser.save()
          .then(result=>{
            res.status(201).json({
              message:"User Created",
              user:result
            });
          })
          .catch(err =>{
            res.status(500).json({
              message:"Error while creating the user",
              error:err
            });
          });
        }
      });
    }
  });
}


exports.user_login=(req,res,next) =>{
  User.findOne({email:req.body.email})
  .exec()
  .then(user =>{
    if(user.length<1){
      return res.status(401).json({
        message:"Auth failed"
      });
    }
    bcrypt.compare(req.body.password,user.password,(err,result) =>{
      if(err){
        return res.status(401).json({
          message:"Auth failed"
        });
      }
      if(result){
        const token= jwt.sign(
          {
            email:user.email,
            userid:user._id
          },
          process.env.JWTKEY,
          {
            expiresIn:"1h"
          }
        );
        return res.status(401).json({
          message:"Auth successfully",
          token:token
        });
      }
      return res.status(401).json({
        message:"Auth failed"
      });
    });
  })
  .catch(err =>{
    res.status(500).json({
      message:"Error while creating the user",
      error:err
    });
  });
}

exports.user_delete=(req,res,next)=>{
  User.deleteOne({_id:req.params.userid})
  .exec()
  .then(result=>{
    res.status(201).json({
      message:"user deleted"
    });
  })
  .catch(err=>{
    res.status(500).json({
      message:err
    });
  });
}
