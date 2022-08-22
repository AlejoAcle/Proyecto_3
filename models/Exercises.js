const mongoose = require("mongoose");

const ExerciceSchema = new mongoose.Schema({
nameExercise:{
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