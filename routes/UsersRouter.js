const express = require("express")
const Users = require("../models/Users")
const Exercice = require("../models/Exercises")
const Marks = require("../models/Marks")
const Booking = require("../models/Booking")
const TimeTable = require("../models/TimeTable")
const UsersRouter = express.Router()
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const auth = require("../middleware/auth")
const authAdmin = require("../middleware/authAdmin")

const cloudinary = require("cloudinary")
const fs = require("fs")
const salt = bcrypt.genSaltSync(10)   // se declara salt para la encriptación de contraseña. 10 es el número de vueltas para hashearse



//we´ll upload images on cloudinary.com
//sign in with mr.kaelego@gmail.com
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
})


UsersRouter.post("/register", async (req, res)=>{
    try {
        const{name, surname, email, password, imagen} = req.body


        const user = await Users.findOne({email})  // busca si el email existe. Si existe no lo crea
        if(user) return res.status(400).json({
            success:false,
            message:"El email introcucido ya existe"
        })

        
        if (!name || !surname || !email || !password){
            return res.status(400).json({
                success: false, 
                message: "Tiene que rellenar todos los campos del formulario"
            })
        }

        if (password.length < 6){
             return res.status(400).json({
                 success: false,
                 message: "La contraseña no puede tener menos de 6 caracteres."
             })
        }

        // Encriptamos la contraseña. se le pasa la pass y salt que es el numero de vueltas
        let passwordHash = bcrypt.hashSync(password, salt)  

        
        const newUser = new Users({
            name,
            surname,
            email,
            password: passwordHash,  // Aquí le pasamos la pass hasheada ya que el valor ha cambiado
            imagen:  {"public_id": "", "url": "https://res.cloudinary.com/kaelego/image/upload/v1664807242/CrossFit%20Upload/lemon_logo_ctybfk.png"}
            // imagen
        })
        await newUser.save()


        return res.status(200).json({
            success:true,
            newUser,
            message:`Se ha creado el usuario de ${name} correctamente.`
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        }) 
    }
})


//Ruta para hacer LOGIN , post que reconozca el usuario
UsersRouter.post("/login", async (req, res)=>{
    try {
        const{email, password} = req.body
        
        if (!email || !password){
            return res.status(400).json({
                success: false,
                message: "Tiene que rellenar usuario y contraseña."
            })
        }

        const user = await Users.findOne({email})  // busca si el email existe. 
        if(!user) return res.status(400).json({ // si no encuentra usuario.. usuario no registrado
            success:false,
            message:"El email introducido no está registrado!"
        })
        const role = user.role
        
        const passwordOk = await bcrypt.compare(password, user.password)
        if (!passwordOk) return res.status(400).json({
            success: false,
            message: "¡Datos incorrectos!"
        })
       
        const accessToken =  createAccessToken({id:user._id})  // Se crea El token de usuario

        return res.status(200).json({
            success:true,
            accessToken,
            role,
            message:`Usuario logueado correctamente`
           
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        }) 
    }
})


// Ruta privada para ver perfil de usuario enviando token
UsersRouter.get("/profile", auth, async (req,res) =>{
    
        try {
            
            const user = await Users.findById(req.user.id)  
            console.log(user)   // Busca en el modelo de usuario si encuentra la ID pasada por token
            if (!user) return res.status(500).json({           // Si no encuentra la id de usuario es que no está logueado
                success: false,
                message: `El usuario no está logueado`
            })
            if (user) return res.status(200).json({
                success: true,
                user
            })


        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            })  
        }
})


// Ruta para modificar perfil enviando ID de usuario por token
UsersRouter.put("/updateProfile", auth, async (req, res) =>{
    
    try {
        const { password, imagen} = req.body // la imagen la paso por row y la uno en el front
        // name, surname, 
        const user = await Users.findById(req.user.id)     // Busca en el modelo de usuario si encuentra la ID pasada por token
        if (!user) return res.status(500).json({           // Si no encuentra la id de usuario es que no está logueado
            success: false,
            message: `El usuario no está logueado`
        })



        // !name && !surname &&
        if ( !password && !imagen){  // Si están todos los campos en blanco salta el error
            return res.status(400).json({
                success: false, 
                message: "No puede dejar todos los campos en blanco"
            })
        }
        // let nameModify
        // if (name){
        //     if (name.length > 0){
        //     nameModify = name 
        //     }
        // }   

        // name ? nameModify = name : name = undefined
        // let surnameModify
        // if (surname){     
        //     if(surname.length >0) surnameModify = surname
        // }
        
    

        let passwordHash
        if (password){                  //Compruebo si el usuario introduce una contraseña
            if (password.length < 6){
                return res.status(400).json({
                    success: false,
                    message: "La contraseña no puede tener menos de 6 caracteres."
                })
           }
            passwordHash = bcrypt.hashSync(password, salt)  // Con esto encriptamos la contraseña. se le pasa la pass y salt que es el numero de vueltas
            // console.log(passwordHash)
    }


    // name: nameModify, surname: surnameModify,
        await Users.findByIdAndUpdate(req.user.id, { password: passwordHash, imagen})
        res.status(200).json({
            success: true,
            message: `Tu perfil se ha actualizado correctamente`
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })  
    }
})


// Ruta para subir una imagen
UsersRouter.post('/upload', auth, async(req, res) =>{
    try {
        const user = await Users.findById(req.user.id)
        if (!user) return res.status(400).json({
            success: false,
            message: "Usuario no logueado"
        })

        
        if(!req.files || Object.keys(req.files).length === 0)
         return res.status(400).json({msg: 'No hay imagen para subir'})
     
     const file = req.files.file;
     console.log(file)
     if(file.size > 1024*1024) {
         removeTmp(file.tempFilePath)
         return res.status(400).json({msg: "Imagen demasiado grande!"})
     }

     if(file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/png'){
         removeTmp(file.tempFilePath)
         return res.status(400).json({msg: "El formato de la imagen no es admitido!"})
     }

     cloudinary.v2.uploader.upload(file.tempFilePath, {folder: "crossfitAPP"}, async(err, result)=>{
        if(err) throw err;

        removeTmp(file.tempFilePath)

        res.json({public_id: result.public_id, url: result.secure_url})
    })
        


    } catch (err) {
        
    }
})

// Ruta para Eliminar imagen
UsersRouter.post("/destroyPhoto", auth, async(req, res) =>{
    try {
        const {public_id} = req.body
    if (!public_id) return res.status(400).json({msg: "No ha seleccionado ninguna foto"})

    cloudinary.v2.uploader.destroy(public_id, async(err, result) =>{
        if (err) throw err
        res.json({msg: "Imagen eliminada"})
    })
    } catch (err) {
        return res.status(500).json({msg: err.message})
    }
    
})

// Ruta para eliminar usuario por token
UsersRouter.delete("/deleteUser", auth, async (req, res) =>{
    try {
       
    await Users.findByIdAndDelete(req.user.id)
    
    // Eliminar los ejercicios, marcas  asociadas al usuario

    Exercice.find({user: req.user.id}).then(foundExercices =>{
        foundExercices.map((arrExercices)=>{
            // console.log("arrExercices",arrExercices)
            Exercice.findByIdAndDelete(arrExercices._id, function(err, arrExercices){
                if (err){
                    console.log(error)
                }else{
                    console.log("Ejercicio eliminado correctamente")
                    Marks.find({user: req.user.id}).then(foundMarks=>{
                        foundMarks.map((arrMarks)=>{
                            // console.log("arrMarks",arrMarks)
                            Marks.findByIdAndDelete(arrMarks._id, function(err, arrMark){
                                if (err){
                                    console.log(err)
                                }else{
                                    console.log("Marca eliminada correctamente")
                                }
                            })
                        })
                    })
                }
            })
        })
    })
    // ELimino reservas asociadas al usuario
    let timeTabless = []
    Booking.find({user: req.user.id}).then(foundBooking =>{
        foundBooking.map((arrBooking)=>{
            // console.log("arrBooking",arrBooking)
            timeTabless.push(arrBooking.timeTable)
            console.log("arrBooking.timeTable",arrBooking.timeTable)
            //     TimeTable.findByIdAndUpdate(arrBooking.timeTable, { 
            //     $pull: {numTotPeople: req.user.id }
            // })

                Booking.findByIdAndDelete(arrBooking._id, function(err, arrBooking){
                    if (err){
                        console.log(err)
                    }else{
                        console.log("Reservas eliminadas correctamente")
                        timeTabless.map((timeID)=>{
                            console.log("timeID",timeID)
                            TimeTable.findByIdAndUpdate(timeID, { 
                            $pull: {numTotPeople: req.user.id }
                        })
                    })
                    }
                })
        })
    })
    // console.log("timeTabless",timeTabless)
    // console.log("req.user.id",req.user.id)
    // timeTabless.map((foundUsers)=>{
    //         TimeTable.findByIdAndUpdate(foundUsers, { 
    //         $pull: {numTotPeople: req.user.id }
    //     })
    // })
    // TimeTable.findByIdAndUpdate(arrBooking.timeTable, { 
    //     $pull: {numTotPeople: req.user.id }
    // })

    res.status(200).json({
        success: true,
        message: "Usuario borrado correctamente."
    })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })  
    }
})

//Ruta para eliminar Usuario por ID
UsersRouter.delete("/deleteUsers/:id", auth, authAdmin, async (req, res) =>{
    try {
        const {id} = req.params
        const user = await Users.findById(req.user.id)
        if (!user) return res.status(500).json({
            success: false,
            message: `El usuario no está logueado`
        })
        
        await Users.findByIdAndDelete(id)
        return res.status(200).json({
            success: true,
            message: "Usuario eliminado correctamente"
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })  
    }
})


//Ruta para listar Usuarios
UsersRouter.get("/usersList", auth, authAdmin, async (req,res) =>{

    try {
        const user = await Users.findById(req.user.id)     
        if (!user) return res.status(500).json({          
            success: false,
            message: `El usuario no está logueado`
        })

        let users = await Users.find({})
        res.status(200).json({
            success: true,
            users
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })  
    }
})


const createAccessToken = (user) =>{
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn:"7d"})
}


const removeTmp = (path) =>{
    fs.unlink(path, err=>{
        if(err) throw err;
    })
}


module.exports = UsersRouter