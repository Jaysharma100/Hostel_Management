import mongoose from "mongoose";
const projectdb=mongoose.connection.useDb('project_hostel')

const userschema= new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    role:{
        type:String,
        enum:["admin","user"],
        default:"user",
    },
    mobile:{
        type:Number,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    avatar:{
        type:String,
        required:true
    }
},{timestamps:true})

const usermodel=projectdb.model('users',userschema )

export default usermodel