//import {express} from "express";
const bodyParser = require("body-parser");
const express = require("express");
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");
const knex = require("knex");
const register = require("./controllers/register");
const signin = require("./controllers/signin");
const profile = require("./controllers/profile");
const image = require("./controllers/image");

const db = knex({
	client: "pg",
	connection: {
		host: "127.0.0.1",
		user: "postgres",
		password: "5199",
		database: "smartbrain",
	},
});

/*db.select("*")
	.from("login")
	.then((data) => console.log(data));*/

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// user signin endpoint
app.post("/signin", signin.handleSignin(db, bcrypt));

// user register endpoint
app.post("/register", register.handleRegister(db, bcrypt));

// gettting users by id
app.get("/profile/:id", profile.handleGetProfile(db));

// image entries update endpoint
app.put("/image", image.handleImage(db));
// image entries update endpoint
app.post("/imageurl", (req, res) => { image.handleApiCall(req,res) });

app.listen(5000, () => {
	console.log("app is running on port 5000");
});
