const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
    },
    clase:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Classes",
    },
   timeTable:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "TimeTable",
},
    status:{
        type: String,
        default: "disponible",
        enum: ["disponible", "no quedan plazas"]
    }
})


module.exports = mongoose.model("Booking", BookingSchema)