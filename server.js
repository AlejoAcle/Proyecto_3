//lineas para levantar servidor junto con la de app.listen, recuerda, instalar dependencias en la terminal
const express = require("express")

const app = express()

const fs = require("fs")

app.use(express.json())
app.use(express.urlencoded())



//metodo escritura RUTAS
//get y devuelve mensaje (endpoint/ruta)// para que el servidor nos devuelva la informacion, de la base de datos o donde esté alojada
app.get('/frase_bienvenida', (req, res) => {
    res.status(200).send({ //res.send({}) es obligatorio, pero el estatus y la respuesta no
        success: true, //ayuda al front-end saber que esta ok
        message: "Hola, soy tu server",
    })
})


app.get(`/inicio`, (req, res) =>{
    res.send({
        success:true,
        message:"Este es el servidor de tu box"
    })
})


//post crea o modifica datos
app.post(`/datos_usuarios`, (req, res) => {
    const {name,city,age,kg,sex} = req.body
    let obj = { //plantilla donde se crea el objeto, u objetos
        usuario: name, //cuando solicite los datos GET, yo veré nombre, ciudad, edad, pero el body tiene el value
        ciudad: city,
        edad: age,
        peso: kg,
        sexo: sex,
    }
    let obj_string = JSON.stringify(obj)

    //estas lines son por el ambito local, en BD no existiran (fs.writefile)
    fs.writeFile(`./datos/${Date.now()}.json`, obj_string, (error) => {
        if (error) {
            return res.status(403).send({
                success: false,
                message: "Algo ha ido mal"
            })
        }
        if (!name || !city || !age || !kg || !sex) {
            return res.status(403).send({
                success: false,
                message: "Completa los campos"
            })
        }

        return res.status(202).send({
            success: true,
            message: "Usuario creado correctamente"
        })

    })
})


//ejemplo
// let object={
//     name:"Alejo",
//     age:"Age"
// }












app.listen(5000, () => {
    console.log("Server is running on port 5000")
})

