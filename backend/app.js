// Import the express module
const express = require("express");
const cors = require('cors');

// Instantiate an Express application
const app = express();
const dataRouter = require('./routers/dataRouter');
// app.use(cors());
const corsOptions = {
    origin: '*',
    methods: 'GET, POST, PUT, DELETE',
    allowedHeaders: '*'
  };
  
app.use(cors(corsOptions));
//parse json input with req.body
app.use(express.json());
app.all("*",(req,res,next)=>{
    console.log("req");
    next();
})
app.use("/api",dataRouter);

app.all("*",(req,res,next)=>{
    // console.log(req)
    return res.status(200).json({
        message: 'this route dont exists , please try again'
    });
})


module.exports = app;