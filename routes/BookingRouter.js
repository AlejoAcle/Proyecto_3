const express = require("express")
const Booking = require("../models/Booking")
const Users = require("../models/Users")
const Classes = require("../models/Classes")
const timeTable = require("../models/TimeTable")
const BookingRouter = express.Router()
const auth = require("../middleware/auth")
const TimeTable = require("../models/TimeTable")


//RUTA POST
BookingRouter.post("/newBooking",auth, async (req,res)=>{

    const{classID,timeTableID} = req.body
    try{
        const user = await Users.findById(req.user.id)
        if (!user) return res.status(400).json({
            success: false,
            message: "Usuario no logueado"
        })

        if (!classID || !timeTableID ){
            return res.status(400).send({
                success:true,
                message:"Completa los campos"
            })
        }

        const currentTimeTable = await TimeTable.findById(timeTableID)
        let found = false

        currentTimeTable.numTotPeople.map((findUser)=>{
            // console.log("findUser", findUser)
            // console.log("user._id", user._id)
            if (findUser.equals(user._id)){
                return found = true
                // return res.json({
                //     success: false,
                //     message: "Ya estás apuntado en la clase"
                // })
            } 
        })
        if (found == true){
            return res.json({
                   success: false,
                   message: "Ya estás apuntado en la clase"
            })
        }

        //  console.log(currentTimeTable)     
        if (currentTimeTable.nPeople <= currentTimeTable.numTotPeople.length){
            return res.json({
                success: false,
                message: "La clase está llena"
            })
        }
    

        let newBooking = new Booking({
            user: req.user.id,
            class: classID,
            timeTable: timeTableID
        })
        await newBooking.save()

        
         await TimeTable.findByIdAndUpdate(timeTableID, {
            $push: {numTotPeople: user._id }
        })
        


        return res.json({
            success: true,
            newBooking,
            message: "Se ha reservado tu clase correctamente"
        })
    } catch (error) {
        return res.json({
            success: false,
            message: error.message
        }) 
    }
})

//ruta delete
BookingRouter.delete("/deleteBooking/:id", auth, async (req, res) =>{
    try {
        const {id} = req.params
        const user = await Users.findById(req.user.id)
        if (!user) return res.status(400).json({
            success: false,
            message: "Usuario no logueado"
        })
    
        //Busco el horario de la reserva para aliminar el registro del usuario
        const TIMEtableID = await Booking.findById(id)
   

        await Booking.findByIdAndDelete(id)

        // Elimino el usuario del array de número total de personas
        await TimeTable.findByIdAndUpdate(
            TIMEtableID.timeTable, {
            $pull: {numTotPeople: user._id }
        })
       

        return res.status(200).json({
            success: true,
            message: "Se ha eliminado su reserva"
        })

          

    } catch (error) {
        return res.json({
            success: false,
            message: error.message
        })  
    }
})


// Ruta para listar una clase por ID y que se muestren los horarios y usuarios apuntados

BookingRouter.get("/bookingList/:id", auth, async (req, res) => {
    const dateID = req.params.id

    try {
        const user = await Users.findById(req.user.id)
        if (!user) return res.status(400).json({
            success: false,
            message: "Usuario no logueado"
        })

        Classes.findById(dateID) //.populate("name")
        .then(date => {
            TimeTable.find({ date: dateID }).populate("user")
                .then(horario => {
                    Booking.find({class: dateID }).populate("user")
                    .then(reservas => {
                    return res.json({
                        success: true,
                        date,
                        horario,
                        reservas,
                        user: user._id
                    })
                })
            })
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        }) 
    }

   
})



module.exports = BookingRouter
