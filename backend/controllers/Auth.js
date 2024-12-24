import usermodel from "../models/user.js"
import hostelmodel from "../models/hostel.js"
import bcryptjs from "bcryptjs"
import jwt from "jsonwebtoken"
import fs from "fs"
import { log } from "console"


const register=async(req,res)=>{
    try{
       const {name,email,role,password,hostel}=req.body
       console.log(req.file);
       const userexist=await usermodel.findOne({email});
       if(userexist){
        return res.status(401).send({suceess:false,message:"user already exist!"})
       }

       const hashpassword=await bcryptjs.hashSync(password,10)

       const newuser=new usermodel({    
        name:name,
        email:email,
        role:role,
        password:hashpassword,
        avatar:'avatars/'+ req.file.filename,
       })

       await newuser.save()

       if(hostel){
        const newhostel=new hostelmodel({
            name:hostel,
            email:email
        })
        await newhostel.save()
       }

       res.status(200).send({newuser})
    }
    catch(err){
        res.status(500).send({suceess:false,message:"internal server error"})
        console.log(err)
    }
}

const login=async(req,res)=>{
    try {
        const {email,password}=req.body
        
        const userexist=await usermodel.findOne({email});
        if(!userexist){
            return res.status(404).send({suceess:false,message:"No such user exist!"})
        }
        
        const ispasswordvalid=await bcryptjs.compare(password,userexist.password)
        if(!ispasswordvalid){
            return res.status(404).send({suceess:false,message:"Invalid Credentials! Try again"})
        }
        
        const token=jwt.sign({user:userexist},process.env.JWT_SECRET,{expiresIn:'1d'});
        res.status(200).send({success:true,message:"Login succesfull",token,user:userexist})
    } 
    catch (error) {
        res.status(500).send({suceess:false,message:"internal server error"})
        console.log(error)
    }
}

const verify = (req, res) => {
  const allowuser = ["/your_room", "/hostels", "/alert", "/about"];
  const allowadmin = ["/admin", "/editroom","/announcement&complaint"];
  const token = req.headers['authorization']?.split(' ')[1];
  const { path } = req.body;

  if (!token) {
      return res.status(401).json({ success: false, message: "Unauthorized!" });
  }
  try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      let auth = 0;
      if (decoded.user.role === "user" && allowuser.includes(path)) {
        auth = 1;
      } else if (decoded.user.role === "admin" && allowadmin.includes(path)) {
        auth = 1;
      }
      if(auth==0){
        let redirect=decoded.user.role==="user"?"/your_room":"/admin";
        return res.status(200).json({success: true, redirect})
      }
      return res.status(200).json({ success: true, email: decoded.user.email });
  } catch (error) {
      return res.status(403).json({ success: false, message: "Invalid Token" });
  }
};

const finduser=async(req,res)=>{
  try{
    const {email}=req.body;
    const user=await usermodel.findOne({email});

    if(!user){
      return res.status(403).json({success:false,message:"User not found!"});
    }
    return res.status(200).json({success:true,message:"user found",user:user});
  }
  catch(err){
    return res.status(500).json({ message: "Internal server error." });
  }
}

const addroomapi = async (req, res) => {
    try {
      const { hostelfind, roomdetails } = req.body;

      if (!hostelfind || !Array.isArray(roomdetails) || roomdetails.length === 0) {
        return res.status(400).json({ message: "Invalid input data." });
      }

      const hostel = await hostelmodel.findOne({ email: hostelfind });
  
      if (!hostel) {
        return res.status(404).json({ message: "Hostel not found." });
      }

      for (const room of roomdetails) {
        let { roomno, floor, capacity } = room;
  
        if (typeof roomno !== "number" || typeof floor !== "number" || typeof capacity !== "number" || capacity < 1) {
          return res.status(400).json({ message: "Invalid room data." });
        }

        const floorKey = String(floor);

        if (!hostel.floors.has(floorKey)) {
          hostel.floors.set(floorKey, []);
        }

        const existingRoom = hostel.floors.get(floorKey).some((r) => r.number === roomno);
        if (existingRoom) {
          continue;
        }
        hostel.floors.get(floorKey).push({ number: roomno, capacity, hostelers: [] });
      }

      await hostel.save();
  
      return res.status(200).json({ message: "Rooms added successfully.", hostel });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error." });
    }
};

const findroom= async (req,res)=>{
  try{
  const {floor,room,hostelfind}=req.body;

  if(!hostelfind || floor === undefined || room === undefined){
    return res.status(400).json({ message: "Missing required fields" });
  }
  
  const hostel= await hostelmodel.findOne({email:hostelfind});
  if(!hostel){
    return res.status(404).json({ message: "Hostel not found." });
  }

  const floordata = hostel.floors.get(floor.toString());
  if(!floordata){
    return res.status(404).json({ message: `Floor ${floor} not found. Recheck!` });
  }

  const roomdetails=floordata.find((r)=>r.number===parseInt(room));

  if(!roomdetails){
    return res.status(404).json({ message: "Room not found. Recheck!" });
  }

  return res.status(200).json({message:"Room data found succesfully", details:roomdetails})
  }
  catch(err){
    return res.status(500).json({message:"Internal server error!"});
  }
}

const findhostel=async(req,res)=>{
  const {email}=req.body;
  const hostel=await hostelmodel.findOne({email});

  if(!hostel){
    return res.status(404).json({success:false,message:"Hostel not Found!"});
  }

  return res.status(200).json({success:true,hostel:hostel});

}

const updatehostel=async(req,res)=>{
  const {name,email,description}=req.body;

  try{
    const hostel=await hostelmodel.findOne({email});
    if(!hostel){
      return res.status(404).json({success:false,message:"Hostel not Found!"});
    }

    if (name) hostel.name = name;
    if (description) hostel.description = description;

    await hostel.save();

    return res.status(200).json({success:true,message:"Hostel details updated succesfully!"})
  }
  catch{
    return res.status(500).json({ success: false, message: "Server error!", error: err.message });
  }
}

const updateprofile = async (req, res) => {
  const { name,email,newemail } = req.body;

  try {
      const user = await usermodel.findOne({ email });

      if (!user) {
          return res.status(404).json({ success: false, message: "User not found!" });
      }

      if (req.file) {
          // Remove old avatar if exists
          if (user.avatar && fs.existsSync(user.avatar)) {
              fs.unlinkSync(user.avatar);
          }
          user.avatar = `avatars/${req.file.filename}`;
      }

      if (name!=="") {
        user.name= name;
      }
      if(newemail!==""){
        user.email= newemail;
      }

      await user.save();
      return res.status(200).json({
          success: true,
          message: "User details updated successfully!",
          user:user
      });
  } catch (err) {
      return res.status(500).json({ success: false, message: "Server error!", error: err.message });
  }
};

export {register,login,verify,finduser,addroomapi,findroom,findhostel,updatehostel,updateprofile}