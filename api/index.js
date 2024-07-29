const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const crypto = require("crypto");
const cors = require("cors");
//const nodemailer = require("nodemailer");

const { createUser, User } = require('./models/User.js');
//const  = require("./models/User");

const app = express();
const port = 3000;

const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.use(cors());
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(express.json());

mongoose.connect("mongodb+srv://saachi2222:catalogue@cluster1.xlqon5w.mongodb.net/").then(() =>{
    console.log("Connected to mongodb!");
}).catch((error)=>{
    console.log("error connecting to mongodb", error);
})

//app.post('/api/users', async (req, res) => {
//  try {
//    const { email, uid } = req.body;
//    const newUser = await createUser({ email, firebaseUid: uid });
//    res.status(201).json(newUser);
//  } catch (error) {
//    console.error('Error creating user:', error);
//    res.status(500).json({ error: 'Failed to create user' });
//  }
//});

app.post('/api/users/check-or-create', async (req, res) => {
  try {
    const { email, uid } = req.body;
    console.log('Received data1:', { email, uid });

    // Check if user already exists
    let user = await User.findOne({ firebaseUid: uid });
    console.log('Received data2:', { email, uid });

    if (user) {
      // User already exists
      res.status(200).json({ message: 'User already exists', user });
    } else {
      // User doesn't exist, create new user
      console.log('Received data3:', { email, uid });
      user = await createUser({ email, firebaseUid: uid });
      res.status(201).json({ message: 'New user created', user });
    }
  } catch (error) {
    console.error('Error checking/creating user:', error);
    res.status(500).json({ error: 'Failed to check/create user' });
  }
});


app.listen(port, () => {
    console.log("Server running on port", port);
});

