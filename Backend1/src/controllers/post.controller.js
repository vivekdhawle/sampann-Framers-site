import { Vendors } from "../models/vendors.model.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import asyncHandler from "../utils/asynchandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Posts } from "../models/post.models.js";

const cpost=asyncHandler(async(req,res)=>{
    const {owner,caption}=req.body
    
    console.log(req.files)
    const postImage=req.files?.postImage[0]?.path
    const image=await uploadOnCloudinary(postImage)
    console.log(image)
    const post=await Posts.create({
        owner,caption,postImage:image.url
    })

    const posted=await Posts.findById(post._id)
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

const seeAllPosts = asyncHandler(async (req, res) => {
    try {
        // Fetch posts and populate the owner field with all user data
        const posts = await Posts.find()
            .populate('owner') // Populate with all fields of the User model
            .exec();
        
        // Debug: Print each post's owner to inspect what is being populated
        posts.forEach(post => {
            console.log('Post Owner:', post.owner); // Print the entire owner object
        });

        // Map posts to include the owner's username and any other desired fields
        const postsWithUserData = posts.map(post => ({
            ...post.toObject(), // Convert Mongoose document to plain JavaScript object
            owner: post.owner || 'Unknown' // Add the owner's data directly
        }));

        return res.status(200).json(new apiResponse(200, { posts: postsWithUserData }, "ok"));
    } catch (error) {
        console.error('Error fetching posts:', error.message);
        return res.status(500).json(new apiResponse(500, null, error.message));
    }
});





const remove=asyncHandler(async(req,res)=>{
    console.log("xvfgdgdd",req.query)
    const {_id}=req.query
    await Vendors.findByIdAndDelete(_id)
    
    res.status(200).json({ message: 'Product deleted successfully' });
})


export {remove,seePost,seeAllPosts,cpost}