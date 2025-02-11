import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
    {
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        match:/.+\@.+\..+/
    },
    phoneNumber:{
        type:String,
        required:true,
        match:/^\+?[1-9]\d{1,14}$/
    },
    address:{
        type:String,
        default:''
    },
}, { timestamps: true })

export default mongoose.model('Contact',contactSchema)