//const bodyParser
const express = require('express');
//import {express} from "express";
const app = express();
app.get('/',(req, res)=>{
    res.send("getting root")
});
app.get('/profile', (req, res)=>{
    res.send("getting profile");
});
app.post('/profile', (req,res)=>{
    console.log(req.body); 
    const user ={
        name:'Ranu',
        age:40
    }
    res.send(user);
});

app.listen(3000);