import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
            name:{
                type:String,
                required:true
            },
            email:{
                type:String,
                required:true,
                unique:true,
                lowercase:true
            },
            password:{
                type:String,
                required:true
            },
            role:{
                type:String,
                required:true,
                enum:["user","admin"], // by we are specifying our website will have two users one is  admin and second is user (consumer)
                default:"user"
            },
            address:{
                type:String,
                
            }
},
{timestamps:true}
);

export default mongoose.model('User',userSchema);