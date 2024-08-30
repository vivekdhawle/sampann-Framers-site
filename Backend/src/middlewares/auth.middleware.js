import jwt from "jsonwebtoken"
import { User } from "../Models/user.model.js"

const verifyJwt=async(req,res,next)=>{
    try {
        console.log("gd",req.cookies)
        const token=await req.cookies?.accessToken||req.header("Authorization")?.replace("bearer","");
        
        const decodedToken= jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
         console.log(decodedToken)
        const user=await User.findById(decodedToken._id).select("-password -refreshToken")
        if(!user){
            throw new apiError(404,"not found")
        }
        console.log("user:",user)
        req.user=user
        
        next()
        
    } catch (error) {
        console.log(error)
        throw new apiError(404,"not found5")
    }
}
export default verifyJwt