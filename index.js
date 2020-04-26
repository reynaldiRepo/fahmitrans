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
const ekspedisi_model = require("./model/ekspedisi.model")
const customer_model = require("./model/customer.model");
const perjalanan_model = require("./model/perjalanan.model");



//Body Parser Setup
App.use(express.json()); // to support JSON-encoded bodies
App.use(express.urlencoded({
    extended: true
})); // to support URL-encoded bodies

//Static File
App.use(express.static(__dirname + '/public'));
App.set('view engine', 'ejs');
App.set('views', path.join(__dirname, '/public'));

App.get("/", (req, res) => {
    res.render("index", {
        status: 0
    });
})

App.post("/login", (req, res) => {
    console.log(req.body)
    user_model.count({
        "_id": req.body.username,
        "password": req.body.password
    }).exec(
        (err, data) => {
            if (err) {
                console.log(err)
            } else {
                console.log(data);
                if (data == 1) {
                    res.redirect("/home");
                } else {
                    res.render("index", {
                        status: 1
                    });
                }
            }
        }
    )
})

App.get("/home", (req, res) => {
    console.log(req.query);
    if (req.query.err == 2) {
        res.render("home", {
            "errAdd": 1
        })
    } else if (req.query.err == 1) {
        res.render("home", {
            "errAdd": 0
        })
    } else {
        res.render("home", {
            "errAdd": 999
        })
    }
})


App.get("/ekspedisi/add", (req, res) => {
    ekspedisi_model.create({
            "name": req.query.name
        },
        (err, data) => {
            if (err) {
                res.json({
                    status: false,
                    msg: err
                })
            } else {
                res.json({
                    status: true,
                    data: data
                })
            }
        }
    )
})

App.get("/ekspedisi/del", (req, res) => {
    ekspedisi_model.deleteOne({
        "_id": req.query._id
    }).exec(
        (err) => {
            if (err) {
                res.json({
                    status: false,
                    msg: err
                })
            } else {
                res.json({
                    status: true
                })
            }
        }
    )
})

App.get("/ekspedisi/all", (req, res) => {
    ekspedisi_model.find().exec(
        (err, data) => {
            if (err) {
                res.json({
                    status: false,
                    msg: err
                })
            } else {
                res.json({
                    status: true,
                    data: data
                })
            }
        }
    )
})

App.get("/customer/add", (req, res) => {
    customer_model.create({
            "name": req.query.name
        },
        (err, data) => {
            if (err) {
                res.json({
                    status: false,
                    msg: err
                })
            } else {
                res.json({
                    status: true,
                    data: data
                })
            }
        }
    )
})

App.get("/customer/del", (req, res) => {
    customer_model.deleteOne({
        "_id": req.query._id
    }).exec(
        (err) => {
            if (err) {
                res.json({
                    status: false,
                    msg: err
                })
            } else {
                res.json({
                    status: true
                })
            }
        }
    )
})

App.get("/customer/all", (req, res) => {
    customer_model.find().exec(
        (err, data) => {
            if (err) {
                res.json({
                    status: false,
                    msg: err
                })
            } else {
                res.json({
                    status: true,
                    data: data

                })
            }
        }
    )
})

App.post("/perjalanan/add", (req, res) => {
    req.body.tanggal = new Date(req.body.tanggal);
    perjalanan_model.create(req.body,
        (err) => {
            if (err) {
                console.log(err)
                res.redirect("/home?err=1");
            } else {
                res.redirect("/home?err=2");
            }
        })
})

App.get("/perjalanan/all", (req, res) => {
    let out = new Date(req.query.year, req.query.month, 0).getDate();
    console.log(out);
    console.log(new Date(req.query.year, req.query.month, out).toISOString());
    perjalanan_model.find({
        "tanggal": {
            $gte: new Date(req.query.year, req.query.month-1, 0).toISOString(),

            $lt: new Date(req.query.year, req.query.month-1, out).toISOString()
        }
    }).sort({
        "tanggal": -1
    }).exec(
        (err, data) => {
            if (err) {
                res.json({
                    status: false,
                    msg: err
                })
            } else {
                res.json({
                    status: true,
                    data: data
                })
            }
        }
    )
})


App.get("/perjalanan/del", (req, res) => {
    perjalanan_model.deleteOne({
        "_id": req.query._id
    }).exec(
        (err) => {
            if (err) {
                console.log(err)
                res.redirect("/home?err=1");
            } else {
                res.redirect("/home?err=2");
            }
        }
    )
})

App.post("/perjalanan/update", (req, res) => {
    perjalanan_model.updateOne({
        "_id": req.body._id
    }, {
        $set: req.body
    }).exec(
        (err) => {
            if (err) {
                console.log(err)
                res.redirect("/home?err=1");
            } else {
                res.redirect("/home?err=2");
            }
        }
    )
})

App.get("/logout", (req, res) =>
    res.redirect("/")
)


App.listen(process.env.PORT || "3000", function () {
    console.log("is connect");
})