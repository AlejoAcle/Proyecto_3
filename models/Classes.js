const mongoose = require("mongoose");

const ClassesSchema = new mongoose.Schema({
date:{
    type: Date,
    required: true
},
wodDay:{
    type: String,
    required: true
},
times:{
    type: mongoose.Types.ObjectId,
    ref: "TimeTable"
}
})

module.exports = mongoose.model("Classes", ClassesSchema)