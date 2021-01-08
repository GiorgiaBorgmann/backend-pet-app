const router = require('express').Router()
const verify = require(('./verifyToken'))
const User = require('../model/User')
const Pet = require('../model/Animal')
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
    User.findByIdAndUpdate(id, { $set: update }, { new: true }, (error, userObj) => {
        if (error) {
            res.status(400).send(err)
        } else {
            res.send('user updated')
        }
    })
})

router.put('/save-pet', verify, async (req, res) => {

    const user = await User.findOneAndUpdate({ _id: req.user._id, },
        {
            $push: {
                savePets: req.body
            }
        },
        { upsert: true, new: true }
    ).exec(function (error, post) {
        if (error) {
            return res.status(400).send({ msg: 'Update failed!' });
        }
        return res.status(200).send(post);
    });
})
router.put('/unsave-pet', verify, async (req, res) => {
    const user = await User.findOneAndUpdate({ _id: req.user._id, },
        {
            $pull: {
                savePets: req.body
            }
        },
        { upsert: true, new: true }
    ).exec(function (error, post) {
        if (error) {
            return res.status(400).send({ msg: 'Update failed!' });
        }
        return res.status(200).send(post);
    });
})
router.put('/adopt-pet/:id', verify, async (req, res) => {
    const idPet = req.params.id
    try {
        const user = await User.findOneAndUpdate({ _id: req.user._id, },
            {
                $push: {
                    adoptedPets: req.body
                }
            },
            { upsert: true, new: true }
        )
        const adoptedStatus = await Pet.findOneAndUpdate({ _id: idPet }, {
            $set: {
                adoptionStatus: "Adopted"
            },
        }, { upsert: true, new: true })

        res.status(200).json({ success: adoptedStatus })
    }
    catch (e) {
        res.status(400).json({ message: e })
    }
})
router.get('/list-saved-pets/:id', verify, (req, res) => {
    let id = req.params.id
    User.findOne({ _id: id }, (err, foundObject) => {
        if (err) {
            res.sendStatus(500)
        } else {
            res.send({ savePets: foundObject.savePets, adoptedPets: foundObject.adoptedPets })
        }
    })
})
module.exports = router