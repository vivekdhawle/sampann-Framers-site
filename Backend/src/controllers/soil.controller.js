import { Plants } from "../models/plants.models";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import asyncHandler from "../utils/asynchandler.js";
import { detectLanguage, translateText } from '../utils/translation.utils.js';

// const getSoil=asyncHandler(async(req,res)=>{
//     const {soilName}=req.query
//     if (!soilName) {
//         throw new apiError(400, "Soil name is required");
//     }
//     const detectedLanguage =  await detectLanguage(soilName);
//     const englishKeyword = await translateText(soilName, 'en');

//     const soil=await Plants.findOne({soilName:englishKeyword})
//     if(!soil){
//         throw new apiError(404,"plant not availabel")
//     }
//    // Prepare an object to store the translated results
//    let translatedSoil = {};

//    // Iterate over each field in the soil document
//    for (const key in soil._doc) {
//        // Skip the _id field
//        if (key !== '_id' && typeof soil[key] === 'string') {
//            // Translate each field's value to the detected language
//            translatedSoil[key] = await translateText(soil[key], detectedLanguage);
//        } else {
//            // Copy the _id field without translation
//            translatedSoil[key] = soil[key];
//        }
//    }

//    return res.status(200).json(new apiResponse(200, { soil: translatedSoil }));
// })

const getSoil=asyncHandler(async(req,res)=>{
    const {soilName}=req.query
    if (!soilName) {
        throw new apiError(400, "Soil name is required");
    }
   
    const soil=await Plants.find({soilName:{$regex:soilName,$options:i}})
    if(!soil){
        throw new apiError(404,"plant not availabel")
    }
   // Prepare an object to store the translated results

   return res.status(200).json(new apiResponse(200, { soil: soilName}));
})

export {getSoil}