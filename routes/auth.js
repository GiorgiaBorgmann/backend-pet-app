const router = require('express').Router();
const User = require('../model/User')
const { registerValidation, logInValidation } = require('../validation')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
router.post('/register', async (req, res) => {
    const { error } = registerValidation(req.body)
    if (error) {
        return res.status(400).send(error.details[0].message)
    }
    //check if the user already exist in the db
    const emailExist = await User.findOne({ email: req.body.email })
    if (emailExist) {
        return res.status(400).send('Email already exists')
    }
    //hash passwords 
    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(req.body.password, salt)
    //creat user
    const user = new User({
        name: req.body.name,
        lastName: req.body.lastName,
        phone: req.body.phone,
        email: req.body.email,
        password: hashPassword
    })
    try {
        const savedUser = await user.save()
        res.send({
            user: user._id,
            name: user.name,
            lastName: user.lastName
        })
    } catch (err) {
        res.status(400).send(err)
    }
});
router.post('/login', async (req, res) => {
    const { error } = logInValidation(req.body)
    if (error) {
        return res.status(400).send(error.details[0].message)
    }
    const user = await User.findOne({ email: req.body.email })
    if (!user) {
        return res.status(400).send('Email does not exists')
    }
    const validPassword = await bcrypt.compare(req.body.password, user.password)
    if (!validPassword) {
        return res.status(400).send('Invalid password')
    }
    //creat token
    const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET)
    res.header('auth-token', token).send(token)

})
module.exports = router;