const express = require("express")
const Exercises = require("../models/Exercises")
const ExercisesRouter = express.Router()
//para poder relacionar los ejercicios, que cada usuario realiza y anote sus marcas
const auth = require("../middleware/auth")
const Users = require("../models/Users")
const Marks = require("../models/Marks")
const authAdmin = require("../middleware/authAdmin")


//esta ruta permite ver las marcas ya creadas, ahora hay que meter el auth
//con auth la ruta es privada, solo accedes si estás login, si no devuelve error no hay token del auth.js
ExercisesRouter.get("/exercises/:id",auth, async (req,res)=>{
    try{
        // const{id} = req.params
        //pasamos por parametros el ID del ejercicio
        const exerciceID =req.params.id
        const user = await Users.findById(req.user.id)

        if(!user){
            return res.status(400).send({
                success:false,
                message:"No has iniciado sesión"
            })
        }

        //ya no necesito relacionar modelos con .populate, el auth se encarga de unir con id
        // let exercices = await Exercises.findById(id).populate({path:"user", select:"name"}).populate({path:"marcas", select:"reps weight exercices"})

        //busca el id del ejercicio dentro del modelo de ejercicios el .then, se ejecuta si encuentra el ejericio(id),
        //accde al modelo de marcas y .find, dentro de marcas en la propiedad de ejercicios, busca si existe el id correspondiente y ve cuantas marcas tienen ese id(del ejercicio)
        //
        Exercises.findById(exerciceID).then(exercices =>{
            Marks.find({exercices:exerciceID}).then(marks =>{
                return res.json({
                    success:true,
                    exercices,
                    marks
                })
            })
        })


        return res.status(200).send({
            success:true,
            message:"Ejercicio cargado con éxito",
            exercices
        })
    }catch(error){
        return res.status(500).send({
            success:false,
            message:error.message
        })
    }
})

//OJO:si se queda oscuro sin error, siempre que haya dos returns, hay algo sin cerrar bien, en una condicion solo puede existir un Return.
ExercisesRouter.post("/newExercises", auth, authAdmin ,async (req,res)=>{
    try{
        const{nameExercise} = req.body
        const user = await Users.findById(req.user.id)
        if (!nameExercise){
            return res.status(400).send({
                success:true,
                message:"Completa los campos"
            })
        }
        if(!isNaN(nameExercise)){
            return res.status(400).send({
                success:false,
                message:"Introduce un ejercicio válido"
            })
        }    

        let exercices = new Exercises({
            nameExercise,
            user
        })
        await exercices.save()
        return res.status(200).send({
            success:true,
            message:"Ejercicio creado correctamente",
            exercices
        })
    }catch(error){
        return res.status(500).send({
            success:false,
            message:error.message
        })
    }
})


ExercisesRouter.put("/updateExercises/:id",auth,authAdmin, async (res, req)=>{
    try{
        const{id} = req.params
        const{marcas} = req.body
        await Exercises.findByIdAndUpdate(id,{marcas})
        return res.status(200).send({
            success:true,
            message:"Ejercicio modificado"
        })
    }catch(error){
        return res.status(500).send({
            success:false,
            message:error.message
        })
    }
})

//delete en cascada, en espera Alex.
module.exports = ExercisesRouter