const bodyParser = require("body-parser");
const express = require("express");
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");
//import {express} from "express";
const app = express();
app.use(bodyParser.json());
app.use(cors());

const database = {
	users: [
		{
			id: "123",
			name: "ray",
			email: "ray@gmail.com",
			password: "1234567",
			entries: 0,
			joined: new Date(),
		},
		{
			id: "124",
			name: "jay",
			email: "jay@gmail.com",
			password: "662288",
			entries: 0,
			joined: new Date(),
		},
		{
			id: "126",
			name: "may",
			email: "may@gmail.com",
			password: "00000",
			entries: 0,
			joined: new Date(),
		},
	],
	login: [
		{
			id: "987",
			hash: "",
			email: "",
		},
	],
};

app.get("/", (req, res) => {
	res.send(database.users);
	
	
});

app.post("/signin", (req, res) => {
	if (
		req.body.email === database.users[0].email &&
		req.body.password === database.users[0].password
	) {
		res.json(database.users[0]);
		console.log('sucess')
	} else {
		res.status(400).json("error logging in");
	}
});
app.post("/register", (req, res) => {
	const { email, name, password } = req.body;
	bcrypt.hash(password, null, null, function (err, hash) {
		console.log(hash);
	});
	database.users.push({
		id: "127",
		name: name,
		email: email,
		password: password,
		entries: 0,
		joined: new Date(),
	});
	res.json(database.users[database.users.length - 1]);
});
app.get("/", (req, res) => {
	res.send(database.users);
});
app.get("/profile/:id", (req, res) => {
	const { id } = req.params;
	let found = false;
	database.users.forEach((user) => {
		if (user.id === id) {
			found = true;
			return res.json(user);
		}
	});
	if (!found) {
		res.status(404).json("no such user");
	}
});
app.post("/image", (req, res) => {
	const { id } = req.body;
	let found = false;
	database.users.forEach((user) => {
		if (user.id === id) {
			found = true;
			user.entries++;
			return res.json(user.entries);
		}
	});
	if (!found) {
		res.status(404).json("no such user");
	}
});

app.listen(5000, () => {
	console.log("app is running on port 5000");
});
