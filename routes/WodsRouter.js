const express = require("express")
const Wods = require("../models/Wods")
const auth = require("../middleware/auth")
const authAdmin = require("../middleware/authAdmin")
const WodsRouter = express.Router()

WodsRouter.get("/wods",auth, async (req,res)=>{
    let wods = await Wods.find({})
    return res.status(200).send({
        succes:true,
        wods
    })
})

WodsRouter.post("/newWods",auth,authAdmin, async (req,res)=>{
    try{
        const{type,name,time,description} = req.body
        if(!name || !type || !time || !description){
            return res.status(400).send({
                succes:false,
                message:"Completa todos los campos"
            })
        } let wods = new Wods({
            name,
            type,
            time,
            description
        })
        await wods.save()
        return res.status(200).send({
            succes:true,
            message:"Wod cargado correctamente",
            wods
        })
    }catch(error){
        return res.status(500).send({
            succes:false,
            message:error.message
        })
    }
})


WodsRouter.put("updateWods/:id",auth,authAdmin, async (req,res)=>{
    try{
        const{id} = req.params
        const{description} = req.body
        await Wods.findByIdAndUpdate(id,{description})
        return res.status(200).send({
            success:true,
            message:"Wod modificado correctamente"
        })
    }catch(error){
        return res.status(500).send({
            succes:false,
            message:error.message
        })
    }
})

//delete hacer ruta

module.exports = WodsRouter


















module.exports = WodsRouter