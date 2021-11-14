const bodyParser = require("body-parser");
const express = require("express");
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");
const knex = require("knex");

const db=knex({
	client: 'pg',
	connection: {
		host: '127.0.0.1',
		user: 'postgres',
		password: '5199',
		database: 'smartbrain'
	}
});
db.select('*').from('users')
	.then(data => console.log(data));

//import {express} from "express";
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
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
	db.select('email', 'hash').from('login')
		.where('email', '=', req.body.email)
		.then(data => {
			const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
			if (isValid) {
				return db
				.select("*")
				.from("users")
				.where("email", "=", req.body.email)
				.then((user) => {
					res.json(user[0]);
				})
					.catch((err) => res.status(400).json("unable to get user"));
			} else {
				res.status(400).json('wrong credentials')
			}
		
		})
	.catch(err => res.status(400).json('wrong credentials'))
});

// user register endpoint
app.post("/register", (req, res) => {
	const { email, name, password } = req.body;
	const hash = bcrypt.hashSync(password);
	db.transaction(trx => {
		trx.insert({
			hash: hash,
			email:email
		})
			.into('login')
			.returning('email')
			.then(loginEmail => {
				return trx('users')
					.returning('*')
					.insert({
						name: name,
						email: loginEmail[0],
						joined: new Date(),
					})
					.then(user=> {
						res.json(user[0]);
					})
			})
			.then(trx.commit)
			.catch(trx.rollback)
	})
		.catch(err => res.status(400).json('unable to register or user already exsist'));
});
	

// gettting users by id
app.get("/profile/:id", (req, res) => {
	const { id } = req.params;
		db.select('*').from('users').where({ id })
		.then(user => {
			if (user.length) {
					res.json(user[0]);
			} else {
				res.status(404).json("user not found");
			}
		})
	  .catch(err=>res.status(404).json("error getting user"));
});

// image entries update endpoint
app.put('/image', (req, res) => {
	const { id } = req.body;
	db('users').where('id', '=', id)
		.increment('entries', 1)
		.returning('entries')
		.then(entries => {
			res.json(entries[0]);
		})
		.catch((err) => res.status(404).json("unable to get entries"));
});
	

app.listen(5000, () => {
	console.log("app is running on port 5000");
});
