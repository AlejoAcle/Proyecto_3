const Users = require("../models/Users")

const authAdmin = async ( req, res, next) =>{
    try {
        const user = await Users.findOne({_id: req.user.id})
    if(user.role === 0 ){
        return res.status(400).send({
            success:true,
            message:"No tienes permisos suficientes, habla con un administrador"
        })
    }
    next()
    } catch (error) {
        return res.status(500).send({
            success:false,
            message:error.message
        })
        
    }
}

module.exports = authAdmin