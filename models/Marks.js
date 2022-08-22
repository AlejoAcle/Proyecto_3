const mongoose = require("mongoose");

const MarksSchema = new mongoose.Schema({
date:{
    type: String,
    required: true
},
reps:{
    type: Number,
    required: true
},
weight:{
    type: Number,
    required: true
},
comment:{
    type: String,
    required: true
},
exercices:{
    type: mongoose.Types.ObjectId,
    ref: "Exercices"
},
user:{
    type: mongoose.Types.ObjectId,
    ref: "Users"
}
})

module.exports = mongoose.model("Marks", MarksSchema)