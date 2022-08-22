const express = require("express")
const Users = require("../models/Users")

const UsersRouter = express.Router()
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const auth = require("../middleware/auth")
const authAdmin = require("../middleware/authAdmin")

const cloudinary = require("cloudinary")
const fs = require("fs")

//we´ll upload images on cloudinary.com
//sign in with mr.kaelego@gmail.com
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
})


UsersRouter.get("/user/:id",auth,authAdmin, async (req, res) => {
    try {
        const {id} = req.params
        let user = await Users.findById(id).populate({
            path: "booking",
            select: "timeTable "
        })
        return res.status(200).send({
            success: true,
            message: "Usuario cargado correctamente",
            user
        })
    } catch (error) {
        return res.status(500).send({
            success: true,
            message: error.message
        })
    }
})



//RUTA PARA REGISTRO, CREAR USUARIO Y COMPROBAR QUE NO ESTÁ YA ESE EMAIL REGISTRADO
UsersRouter.post("/register", async (req, res) => {
    try {
        const {
            name,
            surname,
            email,
            password,
            imagen
        } = req.body

        let foundUser = await Users.findOne({
            email
        })
        if (foundUser) {
            return res.status(400).send({
                success: false,
                message: "Este usuario ya está regristrado"
            })
        }
        if (password.lenght < 6) {
            return res.status(400).send({
                success: false,
                message: "Contraseña demasiado corta"
            })
        }
        if (name.lenght < 3) {
            return res.status(400).send({
                success: false,
                message: "Nombre usuario demasiado corto"
            })
        }

        if ((!isNaN(name)) || (!isNaN(surname))) {
            return res.status(400).json({
                message: "El nombre o el apellido puede contener solo letras, por favor"
            })
        }
        
        if(!( /^[a-zA-ZÀ-ÿ ]+$/.test(name))  || !( /^[a-zA-ZÀ-ÿ ]+$/.test(surname))){
            return res.status(400).send({
                success:false, 
                message:"Solo letras, por favor"
            })
        }

        if (!(/^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,3})$/.test(email)))
            return res.status(400).json({
                message: "El formato de tu correo electronico es incorrecto!"
            })


        let passwordHash = await bcrypt.hash(password, 10)
        let user = new Users({
            name,
            surname,
            email,
            password: passwordHash,
            imagen
        })

        await user.save()
        return res.status(200).send({
            success: true,
            message: "Usuario creado correctamente",
            user
        })
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: error.message
        })
    }
})


//RUTA PARA LOGEARSE UNA VEZ REGISTRADO

UsersRouter.post("/login", async (req, res) => {
    const {
        email,
        password
    } = req.body
    try {
        let foundUser = await Users.findOne({
            email
        })

        if (!email) {
            return res.status(400).send({
                success: false,
                message: "Introduce un email válido"
            })
        }

        if (!password) {
            return res.status(400).send({
                success: false,
                message: "Introduce una contraseña válida"
            })
        }

        if (!foundUser) {
            return res.status(400).send({
                success: false,
                message: "La contraseña o el email son incorrectos.Inténtalo de nuevo"
            })
        }

        let passwordOk = await bcrypt.compare(password, foundUser.password)
        if (!passwordOk) {
            return res.status(400).send({
                success: false,
                message: "La contraseña o el email son incorrectos.Inténtalo de nuevo"
            })
        }
        //introducimos la función del token,spues de las condiciones
        //crea el token de usuario y para un id, crea un token, pasamos el id de usuario, a ese ID = tOKEN unico
        const token = accessToken({id:foundUser._id})
        return res.status(200).send({
            success: true,
            message: "Bienvenido, puedes entrar",
            token
        })

    } catch (error) {
        return res.status(500).send({
            success: false,
            message: error.message
        })
    }
})


//falta ruta delete

UsersRouter.put("/updateUsers/:id",auth, async (req, res) => {
    try {
        const {
            id
        } = req.params
        const {
            password
        } = req.body
        await Users.findByIdAndUpdate(id, {
            password
        })
        return res.status(200).send({
            success: true,
            message: "Usuario modificado correctamente"
        })
    } catch (error) {
        return res.statuts(500).send({
            success: false,
            message: error.message
        })
    }
})





//esta función genera el token
//podemos elegir el tiemp que dura el login activo, en este caso 7d, despues se cerrará la sesión y tendrías que logearte de nuevo

const accessToken = (user)=>{
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn:"7d"})
}


//UPLOAD IMAGE user
UsersRouter.post("/upload", (req, res) => {
    try {
        console.log(req.files)
        if (!req.files || Object.keys(req.files).lenght === 0)
            return res.status(400).send({
                msg: "No files were uploaded"
            })

        const file = req.files.file;
        if (file.size > 1024 * 1024) {
            removeTmp(file.tempFilePath)
            return res.status(400).json({
                msg: "Size too large"
            })
        }


        if (file.mimetype !== "image/jpeg" && file.mimetype !== "image/png") {
            removeTmp(file.tempFilePath)
            return res.status(400).json({
                msg: "File format is incorrect."
            })
        }



        cloudinary.v2.uploader.upload(file.tempFilePath, {
            folder: "CrossFit Upload"
        }, async (err, result) => {
            if (err) throw err;

           removeTmp(file.tempFilePath)

            res.json({
                public_id: result.public_id,
                url: result.secure_url
            }) //solo muestra url e ID
        })




    } catch (error) {
        return res.status(500).send({
            success: false,
            message: error.message
        })
    }
})


//DELETE IMAGE user
UsersRouter.post("/deleteImage",  (req, res) => {
    try {
        const {public_id} = req.body;
        if (!public_id) return res.status(400).json({
            msg: "No image selected"
        })

        cloudinary.v2.uploader.destroy(public_id, async (err, result)=>{
            if(err) throw err;

            res.json({msg:"Deleted image"})
        })

    } catch (error) {
        return res.status(500).json({
            msg: error.message
        })

    }

})

const removeTmp = (path) => {
    fs.unlink(path, err => {
        if (err) throw err;
    })
}



module.exports = UsersRouter