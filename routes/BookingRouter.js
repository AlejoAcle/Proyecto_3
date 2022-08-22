const express = require("express")
const Booking = require("../models/Booking")
const BookingRouter = express.Router()
const auth = require("../middleware/auth")
//RUTA GET
BookingRouter.get("/booking/:id",auth, async (req,res)=>{
    try{
        const{id} = req.params
        let booking = await Booking.findById(id).populate({path:"user", select:"name"}).populate({path:"clase", select:"date wodDay"}).populate({path:"timeTable", select:"time"})

        return res.status(200).send({
            success:true,
            message:"Reserva realizada con exíto",
            booking
        })
    }catch(error){
        return res.status(500).send({
            success:false,
            message:error.message
        })
    }
})
//RUTA POST
BookingRouter.post("/newBooking",auth, async (req,res)=>{
    try{
        const{claseId,timeTableId} = req.body
        const user = await Users.findById(req.user.id)
        if ( !claseId || !timeTableId ){
            return res.status(400).send({
                success:true,
                message:"Completa los campos"
            })
        } let booking = new Booking({
            clase:claseId,
            timeTable:timeTableId,
            user
        })
        await booking.save()
        return res.status(200).send({
            succes:true,
            message:"Reserva creada correctamente",
            booking
        })
    }catch(error){
        return res.status(500).send({
            succes:false,
            message:error.message
        })
    }
})
//RUTA PUT
BookingRouter.put("/updateBooking/:id",auth, async (req,res)=>{
    try{
        const{id} = req.params
        const{timeTable} = req.body
        await Booking.findByIdAndUpdate(id,{timeTable})
        return res.status(200).send({
            succes:true,
            message:"Reserva modificada"
        })
    }catch(error){
        return res.status(500).send({
            succes:false,
            message:error.message
        })
    }
})


module.exports = BookingRouter
