//todo el codigo es un básico para nuevo proyecto back-end(servidor)
//lineas para levantar servidor junto con la de app.listen, recuerda, instalar dependencias en la terminal
const express = require("express")
const app = express()
require("dotenv").config() //imprescindible, si los datos se tienen que ocultar en GitHub
const mongoose = require("mongoose")
const fileUpload = require("express-fileupload")


const BookingRouter = require("./routes/BookingRouter")
const ClassesRouter = require("./routes/ClassesRouter")
const ExcercisesRouter = require("./routes/ExercisesRouter")
const MarksRouter = require("./routes/MarksRouter")
const TimeTableRouter = require("./routes/TimeTableRouter")
const UsersRouter = require("./routes/UsersRouter")
const WodsRouter = require("./routes/WodsRouter")
const cors = require("cors")






app.use(express.json())
app.use(express.urlencoded())
app.use(fileUpload({
    useTempFiles:true
}))
app.use(cors())
//endpoints
app.use("/api",BookingRouter)
app.use("/api",ClassesRouter)
app.use("/api",ExcercisesRouter)
app.use("/api",MarksRouter)
app.use("/api",TimeTableRouter)
app.use("/api",UsersRouter)
app.use("/api",WodsRouter)


//se crea la ruta UPLOAD, pero posteriomente las meto en USERSROUTER y me deshago de upload router


//conexion base de datos
const URL = process.env.MONGODB_URL

mongoose.connect(URL,{
}).then(()=>{
    console.log("BD is connected now")
}).catch(error =>{
    console.log(error)
})










app.listen(5000, () => {
    console.log("Server is running on port 5000")
})
