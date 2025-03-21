import mongoose,{Schema} from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const UserSchema=new Schema({
    username:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        index:true,
    },

    phnNo:{
        type:Number,
        required:true,
       
        trim:true,
    },
    password:{
        type:String,
        required:true,
        trim:true,
    },
    refreshToken:{
        type:String
    }
},{timestamps:true})
UserSchema.pre('save',async function (next){
    if(!this.isModified("password")){return null}
    this.password=await bcrypt.hash(this.password,10)
    next()
})
UserSchema.methods.isPasswordCorrect=async function(password){
    
    return await bcrypt.compare(password,this.password)
}

UserSchema.methods.genrateAccessToken= function(){
    
     return jwt.sign({
        _id:this._id.toString(),
        username:this.username,
        fullname:this.fullname,
        email:this.email,
    },process.env.ACCESS_TOKEN_SECRET,{
        expiresIn:process.env.ACCESS_TOKEN_EXPIRY
    })
}
UserSchema.methods.genrateRefreshToken= function(){
    return jwt.sign({
       _id:this._id.toString()
       
   },process.env.REFRESH_TOKEN_SECRET,{
       expiresIn:process.env.REFRESH_TOKEN_EXPIRY
   })
}
export const User=mongoose.model("user",UserSchema)