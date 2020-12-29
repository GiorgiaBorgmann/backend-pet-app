const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
//import route
const authRoute = require('./routes/auth');
const userinfoRoute = require('./routes/userInfo')
dotenv.config();
//connect to DB
mongoose.connect(
    process.env.DB_CONNECT,
    { useNewUrlParser: true },
    () => console.log('connected to db!')
);


//Middlewars 
app.use(express.json())
app.use(cors())

//route MiddleWar 

app.use('/api/user', authRoute);
app.use('/api/userinfo', userinfoRoute)

app.listen(4000, () => console.log('server up and running'));