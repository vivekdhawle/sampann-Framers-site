import mongoose,{Schema} from "mongoose";
const remediesSchema=Schema({
        remedieName:{
            type:String // remediesToProtectPlant
        },
        remedieDescription:{
            type:String 
        }

})

export const Remedies=mongoose.model("Remedies",remediesSchema)