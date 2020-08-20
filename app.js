require('dotenv').config();
const express= require('express');
const morgan=require('morgan');
const bodyparser=require('body-parser');
const mongoose=require('mongoose');

const app=express();

const productsRoute=require('./api/routes/products');
const ordersRoute=require('./api/routes/orders');
const userRoute=require('./api/routes/users');

mongoose.connect('mongodb+srv://@cluster0.vvngj.mongodb.net/RestApi?retryWrites=true&w=majority',
{
  user: process.env.DBUSER,
  pass: process.env.DBPASS,
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

app.use(morgan('dev'));
app.use(bodyparser.urlencoded({extended:true}));
app.use(bodyparser.json());
app.use('/uploads',express.static('uploads'));

app.use((req,res,next) =>{
  res.header("Access-Control-Allow-Origin",'*');
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if(req.method === 'OPTIONS'){
    req.header('Access-Control-Allow-Methods','GET,POST,PATCH,DELETE,PUT');
    req.status(200).json({});
  }
  next();
});

app.use("/products",productsRoute);
app.use("/orders",ordersRoute);
app.use("/users",userRoute);

app.use((req,res,next) => {
  const err=new Error('not found');
  error.status = 404;
  next(error);
});

app.use((error,req,res,next) =>{
   res.status(error.status || 500);
   res.json({
     error:{
       message:error.message
     }
   });
});

module.exports = app;
