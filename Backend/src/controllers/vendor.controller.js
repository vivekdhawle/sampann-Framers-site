import { Vendors } from "../models/vendors.model.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import asyncHandler from "../utils/asynchandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { User } from "../Models/user.model.js";
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
    if(productName){
        const products=await  Vendors.find({productName:productName}).limit(20)
        return res.status(200).json(new apiResponse(200,{products:products},"done"))
    }
    if(!productName){
        const products=await  Vendors.find().limit(20)
        return res.status(200).json(new apiResponse(200,{products:products},"done"))
    }
    const products=await Vendors.find({productName:productName})
    return res.status(200).json(new apiResponse(200,{products:products},"done"))
})

const remove=asyncHandler(async(req,res)=>{
    const {_id}=req.query
    await Vendors.findByIdAndDelete(_id)
    res.status(200).json({ message: 'Product deleted successfully' });
})

const buyProduct = asyncHandler(async (req, res) => {
    const { productId } = req.query;  // Get product ID from query params
   
    if (!productId) {
        throw new apiError(400, "Product ID is required");
    }

    // Find the product by ID and populate owner details
    const pro = await Vendors.findById(productId);
    
    const product=await User.findById(pro.owner)
    console.log(product)
    if (!product) {
        throw new apiError(404, "Product not found");
    }

    return res.status(200).json(
        new apiResponse(200, { product }, "Product details fetched successfully")
    );
});


import { Posts } from "../models/post.models.js";      // Update this path to your posts model

const calculateAndUpdateAverageLikes = async () => {
    try {
        // Step 1: Calculate average likes for each user
        const averages = await Posts.aggregate([
            {
                $group: {
                    _id: "$owner", // Group by owner (user)
                    averageLikes: { $avg: "$likes" } // Calculate average likes
                }
            }
        ]);

        // Step 2: Update each vendor's document with the calculated average likes
        for (const average of averages) {
            await Vendors.updateMany(
                { owner: average._id }, // Match vendor documents by owner
                { $set: { averageLikes: average.averageLikes } } // Set averageLikes field
            );
        }

        console.log("Average likes calculated and updated successfully!");

    } catch (error) {
        console.error("Error calculating or updating average likes:", error);
    }
};

// Call the function to perform the operation
calculateAndUpdateAverageLikes();

export {remove,seeProduct,seeAllProducts,postProduct,buyProduct}