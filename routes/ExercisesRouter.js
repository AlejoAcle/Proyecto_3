const express = require("express")
const Exercices = require("../models/Exercises")
const ExercisesRouter = express.Router()
//para poder relacionar los ejercicios, que cada usuario realiza y anote sus marcas
const auth = require("../middleware/auth")
const Users = require("../models/Users")
const Marks = require("../models/Marks")
const authAdmin = require("../middleware/authAdmin")

//ruta que devuelva todos los ejercicios

// ExercisesRouter.get("/allexercices", auth, async (req, res)=>{
//         try {
//             const user = await Users.findById(req.user.id)     
//             if (!user) return res.status(500).json({          
//                 success: false,
//                 message: `El usuario no está logueado`
//             })
    
//             let exercices = await Exercices.find({})
//             res.status(200).json({
//                 success: true,
//                 exercices
//             })
    
//         } catch (error) {
//             return res.status(500).json({
//                 success: false,
//                 message: error.message
//             })  
//         }
//     })




//esta ruta permite ver las marcas ya creadas, ahora hay que meter el auth
//con auth la ruta es privada, solo accedes si estás login, si no devuelve error no hay token del auth.js
// Las siguientes dos rutas las uno en el FRONT

// Listar ejercicios de un usuario logueado

ExercisesRouter.get("/exercicesUser", auth, async (req, res) => {

    const user = await Users.findById(req.user.id)
    if (!user) return res.status(400).json({
        success: false, 
        message: "No has iniciado sesión"
    })

    Users.findById(req.user.id).populate("name")
        .then(user1 => {
            Exercices.find({user: req.user.id}) //.populate("marcas")
                .then(exercices => {
                    return res.json({
                        success: true,
                        user1,
                        exercices
                    })
                })
        })
})


// Listar ejercicios por ID y que aparezcan sus marcas

ExercisesRouter.get("/marksUserList/:id", auth, async (req, res) => {
    const exerciceID = req.params.id
    console.log(exerciceID)
    const user = await Users.findById(req.user.id)
    if (!user) return res.status(400).json({
        success: false, 
        message: "Usuario no logueado"
    })

    Exercices.findById(exerciceID) //.populate("name")
        .then(exercices => {
            Marks.find({ exercices: exerciceID }) //.populate("exercices")
                .then(marks => {
                    return res.json({
                        success: true,
                        exercices,
                        marks
                    })
                })
        })
})

//OJO:si se queda oscuro sin error, siempre que haya dos returns, hay algo sin cerrar bien, en una condicion solo puede existir un Return.
//le quito authadmin para habilitar al usuario en react poder ver los ejercicios y subir su marca
ExercisesRouter.post("/newExercises",auth, async (req, res) =>{
    try {
        const {nameExercice} = req.body
        // const {userID} = req.user
        const user = await Users.findById(req.user.id)  
        console.log(user)   // Busca en el modelo de usuario si encuentra la ID pasada por token
        if (!user) return res.status(500).json({           // Si no encuentra la id de usuario es que no está logueado
            success: false,
            message: `El usuario no está logueado`
        })
        
        if (!nameExercice){
            return res.status(400).json({
                success: false,
                message: "No puede dejar el campo el blanco"
            })
        }

        // Compruebo si el ejercicio existe para el usuario logueado

        let exercicesFound = false

        const exercicess = await Exercices.find({user: req.user.id})
        // console.log(exercicess)
        
        exercicess.map((exerciceSearch)=>{
            // console.log("exercicess.nameExercice",exerciceSearch.nameExercice)
            if (exerciceSearch.nameExercice == nameExercice){
                return exercicesFound = true
            }
        })

        if (exercicesFound == true){
            return res.status(400).json({
                success:false,
                message: `El ejercicio ya existe para el usuario ${user.name}` 
            })
        }
        
        
       
        const newExercice = new Exercices({ 
            nameExercice,
            user
        })
        
        await newExercice.save()
        return res.status(200).json({
            success:true, 
            newExercice,
            message: `${nameExercice} se ha creado como nuevo ejercicio`
        })
    

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        }) 
    }
})


// Ruta mara modificar un ejercicio por ID pasando ID de usuario por token

ExercisesRouter.put("/updateExercice/:id", auth, async (req, res) =>{
    try {
        const {id} = req.params
        const {nameExercice} = req.body

        const user = await Users.findById(req.user.id)     // Busca en el modelo de usuario si encuentra la ID pasada por token
        if (!user) return res.status(500).json({           // Si no encuentra la id de usuario es que no está logueado
            success: false,
            message: `El usuario no está logueado`
        })

        // const exercice = await Exercices.findOne({nameExercice})  
        // if(exercice) return res.status(400).json({
        //     success:false,
        //     message: `'${nameExercice}' ya está creado.` 
        // })
        
        if (!nameExercice){
            return res.status(400).json({
                success: false, 
                message: "No puede dejar el ejercicio en blanco"
            })
        }

        await Exercices.findByIdAndUpdate(id, {nameExercice})
        res.status(200).json({
            success: true,
            message: `El ejercicio se ha modificado correctamente.`
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })  
    }
})


// Ruta para eliminar un ejercicio por ID pero estando logueado

ExercisesRouter.delete("/deleteExercice/:id", auth, async (req, res) =>{
    try {
        const {id} = req.params

        const user = await Users.findById(req.user.id)
        if (!user) return res.status(400).json({
            success: false,
            message: "Usuario no logueado"
        })

        await Exercices.findByIdAndDelete(id)

        //Elimino las marcas que están asociadas al ejercicio
        Marks.find({exercices: id}).then(foundMarks =>{
            foundMarks.map((arrMark)=>{
                Marks.findByIdAndDelete(arrMark._id, function(err, arrMark){
                    if (err){
                        console.log(error)
                    }else{
                        console.log("Eliminada marca", arrMark)
                    }
                })
            })
        })

        return res.status(200).json({
            success: true,
            message: "Ejercicio eliminado correctamente"
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })  
    }
})




//delete en cascada, en espera Alex.
module.exports = ExercisesRouter