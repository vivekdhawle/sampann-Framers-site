import mongoose,{Schema} from "mongoose";
const plantSchema=Schema({
    plantName:{
        type:String,
        required:true,
        index:true

    },
    information:{
        type:String
    },
    bestWayToGrow:{
        type:String
    },
    weatherCondtions:{
        temperature: {
            type: String,
            required: true
          },
          seasons: {
            type: String,
            required: true
          },
          humidity: {
            type: String,
            required: true
          },
          atmosphereCondition: {
            type: String,
            required: true
          }
        
    }

})

export const Plants=mongoose.model("Plant",plantSchema)