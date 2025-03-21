import mongoose,{Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2"
const postSchema=new Schema({
    owner:{
        type:Schema.Types.ObjectId,
        ref:"user"
    },
    caption:{
        type:String
    },
    postImage:{
        type:String
    },
    likes:{
        type:Number,
        default:1
    }
    
})
postSchema.plugin(mongooseAggregatePaginate)
export const Posts=mongoose.model("Post",postSchema)