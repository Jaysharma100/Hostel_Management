import mongoose from "mongoose";

const dbconnect=async()=>{
    try{
        await mongoose.connect(process.env.MONGODB_URL)
        console.log('mongodb is connected')
    }
    catch(err){
        console.log(err)
    }
}

export default dbconnect