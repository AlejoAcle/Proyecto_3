const mongoose = require("mongoose");

const WodsSchema = new mongoose.Schema({
type:{
    type: String,
    required: true
},
name:{
    type: String,
    required: true
},
time:{
    type: String,
    required: true
},
description:{
    type: String,
    required: true
}
})

module.exports = mongoose.model("Wods", WodsSchema)