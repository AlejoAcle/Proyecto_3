const express = require("express")
const Marks = require("../models/Marks")
const MarksRouter = express.Router()
const Users = require("../models/Users")
const auth = require("../middleware/auth")



// Ruta para crear una marca nueva
MarksRouter.post("/newMarks", auth ,async (req, res)=>{

    try{
        const{date,reps,weight,comment,exercisesId} = req.body

        const user = await Users.findById(req.user.id)

        if (!user) return res.status(500).json({
            success: false,
            message: `No has iniciado sesión`
        })

        if(!date || !reps || !weight || !exercisesId ){
            return res.status(400).send({
                success:false,
                message:"Completa los campos"
            })
        }
        if(isNaN(weight) || (isNaN(reps))){
            return res.status(400).send({
                success:false,
                message:"Introduce un valor correcto"
            })
        }

        if (reps  <= 0 || weight <=0){
            return res.status(400).json({
                success: false,
                message: "Las repeticiones y el peso no pueden ser negativos"
            })
        }

        let mark = new Marks({
            date,
            reps,
            weight,
            comment,
            exercices:exercisesId,
            user
        })
        // await marks.save()
        let newMark = await mark.save()
        return res.status(200).send({
            success:true,
            message:"Datos cargados correctamente",
            mark: newMark
        })
    }catch(error){
        return res.status(500).send({
            success:false,
            message:error.message
        })
    }
})

// Eliminar una marca por ID

MarksRouter.delete("/deleteUserMark/:id", auth, async (req, res) =>{
    try {
        const {id} = req.params
        const user = await Users.findById(req.user.id)
        if (!user) return res.status(500).json({
            success: false,
            message: `El usuario no está logueado`
        })
        
        await Marks.findByIdAndDelete(id)
        return res.status(200).json({
            success: true,
            message: "Marca eliminada correctamente"
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })  
    }
})



module.exports = MarksRouter