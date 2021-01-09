const router = require('express').Router()
const verify = require(('./verifyToken'))
const User = require('../model/User')
const Pet = require('../model/Animal')
const bcrypt = require('bcryptjs')
const lodash = require('lodash')

router.get('/', verify, (req, res) => {
    res.send(req.user)
})
router.get('/username/:id', verify, async (req, res) => {
    let id = req.params.id
    User.findOne({ _id: id }, (err, foundObject) => {
        if (err) {
            res.sendStatus(500)
        } else {
            res.send(foundObject)
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
    let update = lodash.pick(req.body, ["name", "lastName", "phone", "email", "bio"]);
    update = lodash.pickBy(update, lodash.identity);
    update = lodash.merge(update, {
        password: hashPassword,
        role: "basic"
    });
    User.findByIdAndUpdate(id, { $set: update }, { new: true }, (error, userObj) => {
        if (error) res.status(400).send(err)
        else res.send('user updated')
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
router.get('/usersList', verify, function (req, res) {
    User.find({}, function (err, users) {
        let userMap = [];
        users.forEach((user) => {
            userMap.push(user)
        });
        res.send(userMap);
    });
});
router.get('/petsList', verify, function (req, res) {
    Pet.find({}, function (err, pets) {
        let petMap = [];
        pets.forEach((pet) => {
            petMap.push(pet)
        });
        res.send(petMap);
    });
});
module.exports = router