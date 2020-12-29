const router = require('express').Router()
const verify = require(('./verifyToken'))
const User = require('../model/User')

router.get('/', verify, (req, res) => {
    res.send(req.user)
})
router.get('/username/:id', verify, async (req, res) => {
    let id = req.params.id
    User.findOne({ _id: id }, (err, foundObject) => {
        if (err) {
            res.sendStatus(500)
        } else {
            res.send({ name: foundObject.name, lastName: foundObject.lastName })
        }
    })
    // res.send(req.user)
})

module.exports = router