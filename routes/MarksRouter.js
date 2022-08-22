const express = require("express")
const Marks = require("../models/Marks")
const MarksRouter = express.Router()
const Users = require("../models/Users")
const auth = require("../middleware/auth")
//solo crear y borrar, las veré en el ejercicio (las marcas obtenidas en cada movimiento)



MarksRouter.post("/newMarks", auth ,async (req, res)=>{
    try{
        const{date,reps,weight,comment,exercisesId} = req.body

        const user = await Users.findById(req.user.id)

        if(!date || !reps || !weight || !comment || !exercisesId ){
            return res.status(400).send({
                success:true,
                message:"Completa los campos"
            })
        }
        if(isNaN(weight) || (isNaN(reps))){
            return res.status(400).send({
                success:false,
                message:"Introduce un valor correcto"
            })
        }

        let marks = new Marks({
            date,
            reps,
            weight,
            comment,
            exercices:exercisesId,
            user
        })
        await marks.save()
        return res.status(200).send({
            success:true,
            message:"Datos cargados correctamente",
            marks
        })
    }catch(error){
        return res.status(500).send({
            success:false,
            message:error.message
        })
    }
})

//falta delete



module.exports = MarksRouter