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

app.post("/register", async (req, resp) => {
    let user = new User(req.body);
    let result = await user.save();
    result = result.toObject();
    delete result.password
    Jwt.sign({ result }, jwtKey, { expiresIn: "2h" }, (err, token) => {
        if (err) {
            resp.send("Something Went Wrong");
        }
        resp.send({ result, auth: token })
    })
})

//Login_APIs

app.post("/login", async (req, resp) => {
    if (req.body.password && req.body.email) {
        let user = await User.findOne(req.body).select("-password");
        if (user) {
            Jwt.sign({ user }, jwtKey, { expiresIn: "2h" }, (err, token) => {
                if (err) {
                    resp.send("Something Went Wrong")
                }
                resp.send({ user, auth: token })
            })
        } else {
            resp.send({ result: "No User Found" })
        }
    } else {
        resp.send({ result: "No User Found" })
    }
});

//Product_APIs

app.post("/add-product", verifyToken, async (req, resp) => {
    let product = new Product(req.body);
    let result = await product.save();
    resp.send(result);
});

app.get("/products", verifyToken, async (req, resp) => {
    const products = await Product.find();
    if (products.length > 0) {
        resp.send(products)
    } else {
        resp.send({ result: "No Product Found" })
    }
});

app.delete("/product/:id", verifyToken, async (req, resp) => {
    let result = await Product.deleteOne({ _id: req.params.id });
    resp.send(result)
}),

    app.get("/product/:id", verifyToken, async (req, resp) => {
        let result = await Product.findOne({ _id: req.params.id })
        if (result) {
            resp.send(result)
        } else {
            resp.send({ "result": "No Record Found." })
        }
    })

app.put("/product/:id", verifyToken, async (req, resp) => {
    let result = await Product.updateOne(
        { _id: req.params.id },
        { $set: req.body }
    )
    resp.send(result)
});

app.put("/product/:id", verifyToken, async (req, resp) => {
    let result = await Product.updateOne(
        { _id: req.params.id },
        { $set: req.body }
    )
    resp.send(result)
});

app.get("/search/:key", verifyToken, async (req, resp) => {
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
    resp.send(result);
})

// Middleware

function verifyToken(req, res, next) {
    let token = req.headers[""];
    if (token) {
        token = token.split(' ')[1];
        console.log("Middleware Is Called Inside Condition", token);
        Jwt.verify(token, jwtKey, (err, valid) => {
            if (err) {
                resp.send({ result: "Please Provide Valid Token" });
            } else {
                next();
            }
        })

    } else {
        resp.send({ result: "Please Add Token With Header" });
    }
}

app.listen(PORT, console.log("Server Is Running On Port", PORT));