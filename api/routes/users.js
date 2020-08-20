const express= require('express');
const app=express();
const checkAuth=require('../middleware/check-auth');

const Usercontroller=require('../controllers/users');

app.post("/signup",Usercontroller.user_signup);

app.post("/login",Usercontroller.user_login);

app.delete('/:userid',checkAuth,Usercontroller.user_delete);

module.exports = app;
