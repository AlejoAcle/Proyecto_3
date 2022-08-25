const mongoose = require("mongoose");

const ExerciceSchema = new mongoose.Schema({
nameExercice:{
    type: String,
    required: true
},
marcas:{
    type: mongoose.Types.ObjectId,
    ref: "Marks"
},
user:{
    type: mongoose.Types.ObjectId,
    ref: "Users"
}
})

module.exports = mongoose.model("Exercices", ExerciceSchema)