import mongoose,{Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2"
const vendorSchema=new Schema({
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    productName:{
        type:String,
        lowerCase:true,
        index:true
    },
    productPrize:{
        type:Number,
    },
    productDescription:{
        type:String
    },
    productImage:{
        type:String
    }

})
vendorSchema.plugin(mongooseAggregatePaginate)
export const Vendors=mongoose.model("vendors",vendorSchema)
