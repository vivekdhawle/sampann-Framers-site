import { User } from "../Models/user.model.js";
import { Vendors } from "../models/vendors.model.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import asyncHandler from "../utils/asynchandler.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const genrateAccessTokenAndRefreshToken=async(_id)=>{
    try {
        const user=await User.findById(_id)
        const accessToken=await user.genrateAccessToken()
        const refreshToken= await user.genrateRefreshToken()
    
        user.refreshToken=refreshToken
        await user.save({validateBeforeSave:false})
        return {accessToken,refreshToken}
    } catch (error) {
        throw new apiError(500,"something went wrong")
    }
}

const registerUser=asyncHandler(async(req,res)=>{
    const {username,phnNo,password}=req.body
    if([username,phnNo,password].some((fields)=>fields?.trim()===" ")){
        throw new apiError(401,"all fields are required")
    }
    const userexist=await User.find({$or:[{username},{phnNo}]})
    if (!userexist){
        throw new apiError(401,"user already exist")
    }

    const user=await User.create({
        username,phnNo,password
    })
    const userCreated=await User.findById(user._id).select("-password -rereshToken")
    if(!userCreated){
        throw new apiError(404,"something went wrong while registering")
    };
    return res.status(201).json(
        new apiResponse(201,{user:user},"Registration successfull!!")
    )
})


const loginUser=asyncHandler(async(req,res)=>{
    const {username,phnNo,password}=req.body
    if(!(username||phnNo)){
        throw new apiError(401,"username or phnNo is required")
    }
    if(!password){
        throw new apiError(401,"password is required")
    }
    const user=await User.findOne({$or:[{username},{phnNo}]})
    console.log("hghh",user)
    if(!user){
        throw new apiError(404,"user don't exist register first")
    }

    const {accessToken,refreshToken}=await genrateAccessTokenAndRefreshToken(user._id)

    const options={
        httpOnly:true,
        secure:true
    }
    const loggedIn=await User.findById(user._id).select("-password -refreshToken")
    return res.status(200).cookie("accessToken",accessToken,options).cookie("refreshToken",refreshToken,options).json(new apiResponse(202,{user:loggedIn,accessToken,refreshToken},"user logged in"))
})


const logout=asyncHandler(async(req,res)=>{
    await User.findByIdAndUpdate(req.user._id,{
        $set:{
            refreshToken:null
        }
    },{new:true})

    const options={
        httpOnly:true,
        secure:true
    }
    return res.status(200).clearCookie("accessToken",options).clearCookie("refreshToken",options).json( new apiResponse(200,{},"user logged OUT"))

})

const refreshAccessToken=asyncHandler(async(req,res)=>{
    try {
        const incomingToken=req.body.refreshToken||req.cookies.refreshToken
    
        if(!incomingToken)throw new apiError(200,"unauthorized access")
    
        const decodedToken=await jwt.verify(incomingToken,process.env.REFRESH_TOKEN_SECRET)
        if(!decodedToken)throw new apiError(200,"unauthorized access")
        const user=await User.findById(decodedToken._id)
    
        if(incomingToken!==user.refreshToken){
            throw new apiError(200,"expired")
    
        }
        const {accessToken,newrefreshToken}=await genrateAccessAndRefreshToken(user._id)
        const options={
            httpOnly:true,
            secure:true
        }
        return res.status(200).cookie("accessToken",accessToken,options).cookie("refreshToken",newrefreshToken,options).json( new apiResponse(200,{accessToken,refreshToken:newrefreshToken},"user logged in"))
    
    } catch (error) {
        throw new apiError(401,error?.message)
    }

})

const getUserDetails=asyncHandler(async(req,res)=>{
    const user=await User.findById(req.user._id).select("-password -refreshToken")
    if(!user){
        throw new apiError(404,"login first")
    }


    try {
        const vendors = await Vendors.aggregate([
          {
            // Match vendors by the owner field (userId)
            $match: {
              owner: new mongoose.Types.ObjectId(req.user._id), // Convert userId to ObjectId
            },
          },
        ]);
        return res.status(200).json(new apiResponse(200,{user:user,vendors:vendors},"user Details"))
       
      } catch (error) {
        console.error("Error retrieving vendors:", error);
        throw error;
      }



})


const updatePassword=asyncHandler(async (req,res)=>{
    const {oldPassword,newPassword}=req.body
    if(!(oldPassword||newPassword)){throw new apiError(200,"required")}
    const user=await user.findById(req.user._id)


    const isPasswordCorrect=await user.isPasswordCorrect(oldPassword)
    if(!isPasswordCorrect){throw new apiError(200,"old password incorrect")}

    user.password=newPassword
    user.save({validateBeforeSave:false})

    return res.status(200).json(new apiResponse(200,"changed"))
})



export {registerUser,loginUser,logout,refreshAccessToken,updatePassword,getUserDetails}
