const express = require('express');
const connectDB = require('./config/db');
const http = require("http");
const path = require("path");
const fs = require("fs");
const multer = require("multer");

const app = express();
connectDB();

//init middleware
app.use(express.json());

app.get('/',express.static(path.join(__dirname, "./public")));

//define routes
app.use('/api/add_product',require('./Routes/api/add_product'));
app.use('/api/list_product',require('./Routes/api/list_product'));
app.use('/api/add_cart',require('./Routes/api/add_cart'));
app.use('/api/list_cart',require('./Routes/api/list_cart'));
app.use('/api/add_user',require('./Routes/api/add_user'));
app.use('/api/sign_in',require('./Routes/api/sign_in'));
app.use('/api/auth',require('./Routes/api/sign_in'));

const PORT = process.env.PORT || 5000;


app.listen(PORT,()=>{
    console.log(`Server started on ${PORT}`);
});
