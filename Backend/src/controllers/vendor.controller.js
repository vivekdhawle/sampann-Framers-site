import { Vendors } from "../models/vendors.model.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import asyncHandler from "../utils/asynchandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const postProduct=asyncHandler(async(req,res)=>{
    const {owner,productName,productPrize,productDescription}=req.body
    if(!productName && !productPrize){
        throw new apiError(400,"fileds are required")
    }

    const productImage=req.files?.productImage[0]?.path
    const image=await uploadOnCloudinary(productImage)
    const product=await Vendors.create({
        owner,productName,productPrize,productDescription,productImage:image.url
    })

    const posted=await Vendors.findById(product._id)
    if(!posted){
        throw new apiError(500,"something wrong while posting")
    }
    return res.status(200).json(new apiResponse(200,{product:product},"success"))
})

const seeProduct=asyncHandler(async(req,res)=>{
    const {_id}=req.query

    const products=await Vendors.find({owner:_id})

    return res.status(200).json(new apiResponse(200,{products:products},"success"))
})

const seeAllProducts=asyncHandler(async(req,res)=>{
    const {productName}=req.query
    if(!productName){
        const products=await  Vendors.find().limit(20)
        return res.status(200).json(new apiResponse({products:products}))
    }
    const products=await Vendors.find({productName:productName})
    return res.status(200).json(new apiResponse({products:products}))
})

const remove=asyncHandler(async(req,res)=>{
    const {_id}=req.query
    await Vendors.findByIdAndDelete(_id)
    res.status(200).json({ message: 'Product deleted successfully' });
})

export {remove,seeProduct,seeAllProducts,postProduct}