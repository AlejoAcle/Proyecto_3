const express = require("express")
const TimeTable = require("../models/TimeTable")
const TimeTableRouter = express.Router()
const auth = require("../middleware/auth")
const Users = require("../models/Users")
const authAdmin = require("../middleware/authAdmin")



TimeTableRouter.post("/newTimeTable/:dateID", auth,authAdmin ,async (req,res)=>{
    const {time, nPeople, typeWod} = req.body
    const {dateID} = req.params
    try {
        // console.log("ID de clase", dateID)
        const user = await Users.findById(req.user.id)     // Busca en el modelo de usuario si encuentra la ID pasada por token
        if (!user) return res.status(500).json({           // Si no encuentra la id de usuario es que no está logueado
            success: false,
            message: `El usuario no está logueado`
        })

        //Compruebo que ha introducido todos los datos
        if (!time || !nPeople){
            res.status(400).json({
                success: false, 
                message: "Tiene que rellenar todos los campos"
            })
        }

        // Compruebo si el horario existe para esa clase
        let timeTableFound = false
        
        const timeTabless = await TimeTable.find({date: dateID})
        
        timeTabless.map((timeSearch)=>{
            if (timeSearch.time == time){
                return timeTableFound = true
            }
        })

        if (timeTableFound == true){
            return res.json({
                success: false,
                message: `El horario ya existe para la clase!`
            })
        }

        
    
        const newDate = new TimeTable({
            time,
            nPeople,
            typeWod,
            date: dateID
        })
    
        await newDate.save()
        res.status(200).json({
            success: true,
            message: `Se ha creado correctamente la clase de las ${time}`
        })
    
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        }) 
    }
    
})

TimeTableRouter.put("/updateTimeTable/:id", auth, authAdmin, async (req,res) =>{
    const {time, nPeople, dateID} = req.body
    const {id} = req.params

    try {
        const user = await Users.findById(req.user.id)     // Busca en el modelo de usuario si encuentra la ID pasada por token
        if (!user) return res.status(500).json({           // Si no encuentra la id de usuario es que no está logueado
            success: false,
            message: `El usuario no está logueado`
        })

        const date1 = await TimeTable.findOne({dateID})   //  Compruebo si encuentra date y time.
        const time1 = await TimeTable.findOne({time})
        if (date1 && time1) return res.status(400).json({
            success: false, 
            message: `Ya existe el horario ${time} para la fecha indicada`
        })

        await TimeTable.findByIdAndUpdate(id, {time, nPeople, date: dateID})
        res.status(200).json({
            success: true,
            message: `Se ha modificado el horario a correctamente`
    })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        }) 
    }

})

// Ruta para eliminar un horario por ID

TimeTableRouter.delete("/deleteTimeTable/:id", auth, authAdmin, async (req, res) =>{
    try {
        const {id} = req.params
        const user = await Users.findById(req.user.id)    
        if (!user) return res.status(500).json({          
            success: false,
            message: `El usuario no está logueado`
        })

        await TimeTable.findByIdAndDelete(id)
        return res.status(200).json({
            success: true,
            message: "Horario eliminado correctamente"
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })  
    }
})

module.exports=TimeTableRouter