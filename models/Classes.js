const mongoose = require("mongoose");

const ClassesSchema = new mongoose.Schema({
date:{
    type: Date,
    required: true
},
wodDay:{
    type: String,
    required: true
}
})

module.exports = mongoose.model("Classes", ClassesSchema)