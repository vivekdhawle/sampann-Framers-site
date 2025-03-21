import { Policies } from "../models/policy.models"


const getPolicy=asyncHandler(async(req,res)=>{
    
    const policy=await Policies.find()
    if(!policy){
        throw new apiError(404,"plant not availabel")
    }
    console.log(policy)
   return res.status(200).json(new apiResponse(200, { policy:policy}));
})
export {getPolicy}