const mongoose = require('mongoose')
const petSchema = new mongoose.Schema({
    type:{ type: String},
    Name: { type: String},
    adoptionStatus: { type: String},
    height: { type: String},
    weight: { type: String},
    color: { type: String},
    bio: { type: String},
    hypoallergenic: { type: String},
    diet: { type: String},
    photoURL: { type: String}
})

module.exports = mongoose.model('Pet', petSchema)