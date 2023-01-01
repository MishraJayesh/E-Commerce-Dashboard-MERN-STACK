const express = require("express");
const cors = require("cors");
const connectToDB = require('./db/index');
const User = require('./models/User');
const Product = require("./models/Product");
const Jwt = require('jsonwebtoken');
const jwtKey = 'e-com';
const app = express();
const PORT = 8000;

//Connecting Database

connectToDB();

//Allowing JSON Objects

app.use(express.json());
app.use(cors());

//SignUp_Or_Register_APIs

app.post("/register", async (req, res) => {
    let user = new User(req.body);
    let result = await user.save();
    result = result.toObject();
    delete result.password
    Jwt.sign({ result }, jwtKey, { expiresIn: "2h" }, (err, token) => {
        if (err) {
            res.send("Something Went Wrong");
        }
        res.send({ result, auth: token })
    })
})

//Login_APIs

app.post("/login", async (req, res) => {
    if (req.body.password && req.body.email) {
        let user = await User.findOne(req.body).select("-password");
        if (user) {
            Jwt.sign({ user }, jwtKey, { expiresIn: "2h" }, (err, token) => {
                if (err) {
                    res.send("Something Went Wrong")
                }
                res.send({ user, auth: token })
            })
        } else {
            res.send({ result: "No User Found" })
        }
    } else {
        res.send({ result: "No User Found" })
    }
});

//Product_APIs

app.post("/add-product", verifyToken, async (req, res) => {
    let product = new Product(req.body);
    let result = await product.save();
    res.send(result);
});

app.get("/products", verifyToken, async (req, res) => {
    const products = await Product.find();
    if (products.length > 0) {
        res.send(products)
    } else {
        res.send({ result: "No Product Found" })
    }
});

app.delete("/product/:id", verifyToken, async (req, res) => {
    let result = await Product.deleteOne({ _id: req.params.id });
    res.send(result)
}),

    app.get("/product/:id", verifyToken, async (req, res) => {
        let result = await Product.findOne({ _id: req.params.id })
        if (result) {
            res.send(result)
        } else {
            res.send({ "result": "No Record Found." })
        }
    })

app.put("/product/:id", verifyToken, async (req, res) => {
    let result = await Product.updateOne(
        { _id: req.params.id },
        { $set: req.body }
    )
    res.send(result)
});

app.put("/product/:id", verifyToken, async (req, res) => {
    let result = await Product.updateOne(
        { _id: req.params.id },
        { $set: req.body }
    )
    res.send(result)
});

app.get("/search/:key", verifyToken, async (req, res) => {
    let result = await Product.find({
        "$or": [
            {
                name: { $regex: req.params.key }
            },
            {
                company: { $regex: req.params.key }
            },
            {
                category: { $regex: req.params.key }
            }
        ]
    });
    res.send(result);
})

// Middleware

function verifyToken(req, res, next) {
    let token = req.headers[""];
    if (token) {
        token = token.split(' ')[1];
        console.log("Middleware Is Called Inside Condition", token);
        Jwt.verify(token, jwtKey, (err, valid) => {
            if (err) {
                res.send({ result: "Please Provide Valid Token" });
            } else {
                next();
            }
        })

    } else {
        res.send({ result: "Please Add Token With Header" });
    }
}

app.listen(PORT, console.log("Server Is Running On Port", PORT));