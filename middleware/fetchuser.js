const jwt=require('jsonwebtoken');
const JWT_SIGN=process.env.JWT_SIGN;
const fetchuser=(req,res,next)=>{
    const token=req.header('authToken');
    if(!token){
        res.status(401).send({error:"Authentication failed"});
    }
    try {
        const data=jwt.verify(token,JWT_SIGN);
        req.user=data.user;
        next();
    } catch (error) {
        res.status(401).json({error:error});
    }
}
module.exports=fetchuser;