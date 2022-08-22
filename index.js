const express = require("express") // - linea imprescindible
const app = express()  // - linea imprescindible

const fs = require("fs")

app.use(express.json())  // - linea imprescindible   - estas 2 lineas para poder pasar body en postman en x-www-form-urlencoded
app.use(express.urlencoded())  // - linea imprescindible


app.get("/", (req, res)=>{  // - linea imprescindible
    return res.status(200).send({
        success: true, 
        message:"Hola, que tal?"
    })
})

app.get("/alumno", (req, res)=>{ // - linea imprescindible
    return res.status(200).send({
        success: true, 
        message:"Estamos en la primera clase de NodeJs con Alejo"
    })
})


app.post("/create", (req, res) =>{ // - linea imprescindible
     const {name, city, age, study, married} = req.body

    //  const name = req.body.name
    //  const city = req.body.city
    let objeto = {
        nombre:name,
        poblacion:city,
        edad: age,
        estudios: study,
        estado_civil: married

    }

    // let objeto2 = {
    //     name:name,
    //     city:city,
    //     age: age,
    //     study: study,
    //     married: married

    // }

    let obj_string = JSON.stringify(objeto)

    fs.writeFile(`./datos/${Date.now()}.json`, obj_string, (error) =>{
          if(error){
            return res.status(403).send({
                success: false, 
                message:"Algo ha ido mal"
            })
          }
        
          return res.status(202).send({
               success: true, 
               message:"Usuario creado correctamente"
        })

    })

})



// - lineas imprescindible
app.listen(5000, () => {
    console.log("Server is listening for request on port 5000")
})