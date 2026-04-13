

const adminMiddleware = async (req,res,next) =>{
    try {
        if(!req.user || req.user.role !== "admin"){
            return res.status(401).json({message:"Not Authorized"});
        }
        next();
    } catch (error) {
        res.status(500).json({message:error.message});
    }
};

export default adminMiddleware;