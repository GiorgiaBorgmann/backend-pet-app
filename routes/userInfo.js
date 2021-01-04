const router = require('express').Router()
const verify = require(('./verifyToken'))
const User = require('../model/User')
const bcrypt = require('bcryptjs')

router.get('/', verify, (req, res) => {
    res.send(req.user)
})
router.get('/username/:id', verify, async (req, res) => {
    let id = req.params.id
    User.findOne({ _id: id }, (err, foundObject) => {
        if (err) {
            res.sendStatus(500)
        } else {
            res.send({ name: foundObject.name, lastName: foundObject.lastName, role: foundObject.role })
        }
    })
})

router.put('/user/:id', async (req, res) => {
    let id = req.params.id
    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(req.body.password, salt)
    const emailExist = await User.findOne({ email: req.body.email })
    if (emailExist) {
        return res.status(400).send('Email already exists')
    }
    //creat user
    const update = {
        name: req.body.name,
        lastName: req.body.lastName,
        phone: req.body.phone,
        email: req.body.email,
        bio: req.body.bio,
        password: hashPassword,
        role: "basic"
    }
    User.findOneAndUpdate({ _id: id }, update, { upsert: true }, (error, userObj) => {
        if (error) {
            res.status(400).send(err)
        } else {
            res.send('user updated')
        }
    })
})

module.exports = router