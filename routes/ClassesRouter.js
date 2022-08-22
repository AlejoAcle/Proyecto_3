const express = require("express")
const auth = require("../middleware/auth")
const authAdmin = require("../middleware/authAdmin")
const Classes = require("../models/Classes")
const ClassesRouter = express.Router()

//Esta ruta coge todas las clase
ClassesRouter.get("/classes", auth,async (req, res) => {
    try {
        let classe = await Classes.find({})

        return res.status(200).send({
            success: true,
            message: "Clase",
            classe
        })
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: error.message
        })
    }
})


ClassesRouter.post("/newClasses",auth,authAdmin, async (req, res) => {
    const {
        date,
        wodDay
    } = req.body
    try {
        let classes = new Classes({
            date, //una fecha pasamos
            wodDay
        })
        if (!date || !wodDay) {
            return res.status(400).send({
                success: false,
                message: "Completa todos los campos"
            })
        }
        return res.status(200).send({
            success: true,
            message: "Clase creada correctamente",
            classes
        })
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: error.message
        })
    }
})

//put y delete una con el id de classe

ClassesRouter.put("/updateClasse/:id",auth, authAdmin, async (req,res)=>{
    try {
        const{id} = req.params
        const{classe} = req.body
        await Classes.findByIdAndUpdate(id,{classe})
        return res.status(200).send({
            success:true,
            message:"Clase modificada"
        })
    } catch (error) {
        return res.status(500).send({
            success:false,
            message:error.message
        })
    }
})







module.exports = ClassesRouter