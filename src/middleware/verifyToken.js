import jwt from "jsonwebtoken";
export const verifyToken = async(req, replay)=>{ 
    try {
        const authHeaders = req.headers["authorization"]; 
        if(!authHeaders || !authHeaders.startsWith("Bearer ")){
            console.log("unauthorized")
            return replay.status(403).send({message:"unauthorized"}); 
         
        } 
        const token = authHeaders.split(" ")[1]; 
        const decoded = jwt.verify(token, process.env.ACESS_TOKEN_SCRET, );
        req.user = decoded
    } catch (error) {
        console.log(error);
       return replay.status(403).send({message:"Unauthorized"}); 
       
    }

}