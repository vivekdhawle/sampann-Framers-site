import { Plants } from "../models/plants.models.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import asyncHandler from "../utils/asynchandler.js";
import { detectLanguage, translateText } from '../utils/translation.utils.js';
// const getPlants=asyncHandler(async(req,res)=>{
//     const {plantName}=req.query

//     const detectedLanguage =  await detectLanguage(plantName);
//     const englishKeyword = await translateText(plantName, 'en');


//     const plant=await Plants.findOne({plantName:englishKeyword})
//     if(!plant){
//         throw new apiError(404,"plant not availabel")
//     }

//     let translatedPlant = {};

//    // Iterate over each field in the soil document
//    for (const key in plant._doc) {
//        // Skip the _id field
//        if (key !== '_id' && typeof plant[key] === 'string') {
//            // Translate each field's value to the detected language
//            translatedPlant[key] = await translateText(plant[key], detectedLanguage);
//        } else {
//            // Copy the _id field without translation
//            translatedPlant[key] = plant[key];
//        }
//    }

//    return res.status(200).json(new apiResponse(200, { plant: translatedPlant }));
// })

const getPlants=asyncHandler(async(req,res)=>{
    const {plantName}=req.query
    const plant=await Plants.find({plantName:{ $regex: plantName, $options: 'i' }})
    if(!plant){
        throw new apiError(404,"plant not availabel")
    }
    console.log(plant)
   return res.status(200).json(new apiResponse(200, { plant: plant}));
})
export {getPlants}