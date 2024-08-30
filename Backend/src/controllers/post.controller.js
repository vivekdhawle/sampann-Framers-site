import { Vendors } from "../models/vendors.model.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import asyncHandler from "../utils/asynchandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Posts } from "../models/post.models.js";

const post=asyncHandler(async(req,res)=>{
    const {owner,caption}=req.body
    

    const postImage=req.files?.postImage[0]?.path
    const image=await uploadOnCloudinary(postImage)
    const post=await Posts.create({
        owner,comments,caption,postImage:image.url
    })

    const posted=await Posts.findById(product._id)
    if(!posted){
        throw new apiError(500,"something wrong while posting")
    }
    return res.status(200).json(new apiResponse(200,{post:post},"success"))
})

const seePost=asyncHandler(async(req,res)=>{
    const {_id}=req.query
    const post=await Posts.find({owner:_id})
    return res.status(200).json(new apiResponse(200,{post:post},"success"))
})

const seeAllPosts=asyncHandler(async(req,res)=>{
    
    
    const posts=await Posts.find()
    return res.status(200).json(new apiResponse({posts:posts}))
})

const remove=asyncHandler(async(req,res)=>{
    const {_id}=req.query
    await Vendors.findByIdAndDelete(_id)
    res.status(200).json({ message: 'Product deleted successfully' });
})


export {remove,seePost,seeAllPosts,post}