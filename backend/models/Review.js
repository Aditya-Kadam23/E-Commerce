import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
        user:{
            type:mongoose.Schema.Types.ObjectId, //by doing this we are referencing the user who reviwed this product
            ref:"User",
            required:true
        },
        product:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Product",
            required:true
        },
        rating:{
            type:Number,
            required:true,
            min:1,
            max:5
        },
        comment:{
            type:String,
            required:true
        }
},
{timestamps:true}
);

export default mongoose.model("Review",reviewSchema);

