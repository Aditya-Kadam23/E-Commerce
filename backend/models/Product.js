import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
        name:{
            type:String,
            required:true,
            trim:true // it removes starting and end spaces => if we want to store "   i phone" it will store "i phone" means removes unwanted starting and ending space
        },
        description:{
            type:String,
            required:true
        },
        price:{
            type:Number,
            required:true
        },
        category:{
            type:String,
            required:true
        },
        stock:{
            type:Number,
            required:true
        },
        images:[{
          url: {
            type:String,
            required:true
           },
          public_id: {
            type:String,
            required:true
           }
        }],
        rating:{
            type:Number,
            default:0
        },
        numReviews:{
            type:Number,
            default:0
        }

},
{timestamps:true}
)


export default mongoose.model('Product',productSchema);