import mongoose,{Schema} from "mongoose";
const soilSchema=Schema({
        methodToImproveSoilFertility:{
            type:String  //methods to improve soil fertility
        },
        methodDescription:{
            type:String,
        },
        methodcost:{
            type:String //per squaare ,meter
        }

})

export const Soil=mongoose.model("Soil",soilSchema)