const express = require("express")
const TimeTable = require("../models/TimeTable")
const TimeTableRouter = express.Router()
const auth = require("../middleware/auth")
const Users = require("../models/Users")
const authAdmin = require("../middleware/authAdmin")

TimeTableRouter.get("/timetable/:id",auth , async (req, res)=>{
    try{
        const{id} = req.params
        let timetable = await TimeTable.findById(id).populate({path:"user", select:"name"}).populate({path:"date",select:"Classes"})

        return res.status(200).send({
            success:true,
            message:"Horario creado",
            timetable
        })
    }catch(error){
        return res.status(500).send({
            success:false,
            message:error.message
        })
    }
})


TimeTableRouter.post("/newTimeTable", auth,authAdmin ,async (req,res)=>{
    try{
        const{time,nPeople,date,numTotPleople} = req.body
        const user = await Users.findById(req.user.id)
        if(!time || !nPeople || !date || !numTotPleople){
            return res.status(400).send({
                success:false,
                message:"Completa todos los campos"
            })
        } let timetable = new TimeTable({
            time,//tiempo que dura
            nPeople,
            date,//horario dentro del dia 
            numTotPeople,
            user
            
        })
        await timetable.save()
        return res.status(200).send({
            succes:true,
            message:"Horario cargado correctamente",
            timetable
        })
    }catch(error){
        return res.status(500).send({
            success:false,
            message:error.message
        })
    }
})

TimeTableRouter.put("/updateTimeTable/:id",auth, authAdmin , async (req,res)=>{
    try{
        const{id} = req.params
        const{description} = req.body
        await TimeTable.findByIdAndUpdate(id, {time})
        return res.status(200).send({
            success:true,
            message:"horario modificado correctamente"
        })
    }catch(error){
        return res.status(500).send({
            success:false,
            message:error.message
        })
    }
})


module.exports=TimeTableRouter