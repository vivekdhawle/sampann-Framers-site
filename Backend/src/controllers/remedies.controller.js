import { Remedies } from "../models/remedies.js"
import asyncHandler from "../utils/asynchandler.js"
import { apiResponse } from "../utils/apiResponse.js"
const getRemedies=asyncHandler(async(req,res)=>{
    
    const remedies=await Remedies.find()
    if(!remedies){
        throw new apiError(404,"plant not availabel")
    }
    console.log(remedies)
   return res.status(200).json(new apiResponse(200, { remedies:remedies}));
})
export {getRemedies}