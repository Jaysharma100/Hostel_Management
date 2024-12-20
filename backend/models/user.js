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
    password:{
        type:String,
        required:true
    },
    avatar:{
        type:String,
        required:true
    },
    hostel:{
        type:String,
        required:false
    }
},{timestamps:true})

const usermodel=projectdb.model('users',userschema )

export default usermodel