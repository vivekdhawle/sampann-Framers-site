import mongoose,{Schema} from "mongoose";
const plantSchema=Schema({
    plantName:{
        type:String,
        required:true,
        index:true

    },
    information:{
        type:String //must include range of months from when to when and time required to grow other details 
    },
    bestWayToGrow:{
        sowingMethods:{
          type:String
        },
        depth:{
          type:String
        },
        
    },
    weatherCondtions:{
        temperature: {
            type: String,
            required: true
          },
          growingSeasons: {
            type: String,
            required: true
          },
          humidity: {
            type: String,
            required: true
          },
          rainfallRequired: {
            type: String,
            required: true
          }
        
    },
    pesticideQuantity:{
      type:String  //amout of pesticide per square meter of land
    },
    sideEffectsonSoilFertility:{
      type:String
    }

})

export const Plants=mongoose.model("Plant",plantSchema)