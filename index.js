var path = require('path');
const express = require("express");
const App = express();
const bodyparser = require("body-parser");
const mongoose = require("mongoose");

// connect db
mongoose.connect("mongodb+srv://reynaldi:aldi040898@cluster0-nzwso.mongodb.net/test?retryWrites=true&w=majority", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
    },
    (error) => {
        if (error) {
            console.log(error);
        } else {
            console.log("DB Connect")
        }
})

const user_model = require("./model/user.model");


//Body Parser Setup
App.use(express.json()); // to support JSON-encoded bodies
App.use(express.urlencoded({
    extended: true
})); // to support URL-encoded bodies

//Static File
App.use(express.static( __dirname + '/public'));
App.set('view engine', 'ejs');
App.set('views', path.join(__dirname, '/public'));



App.get("/", (req, res)=>{
    res.render("index", {status:0});
})

App.post("/login", (req, res)=>{
    console.log(req.body)
    user_model.count({"_id":req.body.username, "password":req.body.password}).exec(
        (err, data)=>{
            if(err){
                console.log(err)
            }else{
                console.log(data);
                if(data == 1){
                    res.redirect("/home");
                }else{
                    res.render("index", {status:1});
                }
            }
        }
    )
})

App.get("/home", (req, res)=>{
    res.render("home")
})

App.listen(process.env.PORT || "3000", function(){
    console.log("is connect");
})