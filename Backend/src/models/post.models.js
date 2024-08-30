import mongoose,{Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2"
const postSchema=new Schema({
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    caption:{
        type:String
    },
    postImage:{
        type:String
    }
    
})
postSchema.plugin(mongooseAggregatePaginate)
export const Posts=mongoose.model("Post",postSchema)