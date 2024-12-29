import mongoose from "mongoose";
const projectdb=mongoose.connection.useDb('project_hostel')

const annschema= new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
     messages:{
        type: [
            {
            text: { type: String, required: true },
            createdAt: { type: Date, default: Date.now },
            },
        ],
        default: [],
    }
},{timestamps:true})

const annmodel=projectdb.model('announcements',annschema )

export default annmodel