const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
//import route

const authRoute = require('./routes/auth');
dotenv.config();
//connect to DB
mongoose.connect(
    process.env.DB_CONNECT,
    { useNewUrlParser: true },
    () => console.log('connected to db!')
);


//Middlewars 
app.use(express.json())

//route MiddleWar 

app.use('/api/user', authRoute);

app.listen(4000, () => console.log('server up and running'));