const jwt = require("jsonwebtoken")
//dependencia y funcion generica para la autenticación a través de Token
const auth = (req,res,next) =>{
    try {
        const token = req.header("Authorization");

        if (!token){
            return res.status(400).send({
                success:false,
                message:"No hay token",
            });
        }

        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err,user)=>{
            if(err)
            return res.status(400).send({
                success:false,
                message:"Invalid authentification"
            })
            req.user = user;
            console.log(user);
            next();
        })
    } catch (error) {
        return res.status(500).send({
            success:false,
            message:error.message,
        })
    }
};

module.exports = auth;