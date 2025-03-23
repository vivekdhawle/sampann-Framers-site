import mongoose,{Schema} from "mongoose";
const policiesSchema=Schema({
        policyName:{
            type:String
        }

})

export const Policies=mongoose.model("Policies",policiesSchema)