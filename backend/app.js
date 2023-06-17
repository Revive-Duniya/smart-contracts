// Import the express module
const express = require("express");
// Instantiate an Express application
const app = express();
const dataRouter = require('./routers/dataRouter');

//parse json input with req.body
app.use(express.json());

app.use("/api",dataRouter);

app.all("*",(req,res,next)=>{
    // console.log(req)
    return res.status(200).json({
        message: 'this route dont exists , please try again'
    });
})


module.exports = app;