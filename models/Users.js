const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
name:{
    type: String,
    required: true
},
surname:{
    type: String,
    required: true
},
email:{
    type: String,
    required: true
},
password:{
    type: String,
    required: true
},
exercice:{ 
    type: mongoose.Types.ObjectId,
    ref: "Exercices"
},
booking:{
    type: mongoose.Types.ObjectId,
    ref: "Booking"
},
imagen:{
    type: Object
},
role: {
    type: Number,
    default: 0
}

})

module.exports = mongoose.model("Users", UserSchema)