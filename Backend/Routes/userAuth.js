const jwt=require('jsonwebtoken');

const authenticateToken=(req,res,next)=>{
    const authHeader= req.headers["authorization"];
    const tokens = authHeader && authHeader.split(" ")[1];

    if(tokens==null){
        return res.status(401).json({message: "Authentication token required"});

    }
    jwt.verify(tokens,"projectmanagement123",(err,user)=>{
        if(err){
            return res.status(403).json(err);
        }
        req.user=user;
        next();
    });
};

module.exports={authenticateToken};