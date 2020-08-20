const express=require('express');
const app=express();
const checkAuth=require('../middleware/check-auth');
const OrdersController=require('../controllers/orders');

//Hanlding order request
app.route("/")
  .get(checkAuth,OrdersController.orders_get_all)

  .post(checkAuth,OrdersController.orders_create_order);


app.route("/:orderID")
  .get(checkAuth,OrdersController.orders_getbyid)

  .delete(checkAuth,OrdersController.orders_delete);

module.exports=app;
