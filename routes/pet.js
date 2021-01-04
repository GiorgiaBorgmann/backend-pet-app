
const router = require('express').Router();
const Pet = require('../model/Pet')
router.post('/new-pet', async (req, res) => {
    //creat pet
    const pet = new Pet({
        type: req.body.type,
        Name: req.body.Name,
        adoptionStatus: req.body.adoptionStatus,
        height: req.body.height,
        weight: req.body.height,
        color: req.body.color,
        bio: req.body.bio,
        hypoallergenic: req.body.hypoallergenic,
        diet: req.body.diet,
        photoURL: req.body.photoURL
    })
    try {
        const savedPet = await pet.save()
        res.send({
            pet: pet._id
        })
    } catch (err) {
        res.status(400).send(err)
    }
});
router.get('/pet-list', async (req, res) => {
    const petList = await Pet.find({})
    res.send(petList)
})
router.get('/:id', async (req, res) => {
    let id = req.params.id
    const pet = await Pet.findOne({ _id: id })
    res.send(pet)
})
router.put('/update/:id', async (req, res) => {
    let id = req.params.id
    //creat user
    const update = {
        type: req.body.type,
        Name: req.body.Name,
        adoptionStatus: req.body.adoptionStatus,
        height: req.body.height,
        weight: req.body.height,
        color: req.body.color,
        bio: req.body.bio,
        hypoallergenic: req.body.hypoallergenic,
        diet: req.body.diet,
        photoURL: req.body.photoURL
    }
    Pet.findOneAndUpdate({ _id: id }, update, { upsert: true }, (error, userObj) => {
        if (error) {
            res.status(400).send(err)
        } else {
            res.status(200).json({ success: userObj })
        }
    })
})
module.exports = router;