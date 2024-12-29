import usermodel from "../models/user.js"
import hostelmodel from "../models/hostel.js"
import annmodel from "../models/announcement.js"
import bcryptjs from "bcryptjs"
import jwt from "jsonwebtoken"
import fs from "fs"
import complaint_replymodel from "../models/complaint.js"


const register=async(req,res)=>{
    try{
       const {name,email,role,password,hostel,mobile,location}=req.body
       const userexist=await usermodel.findOne({email});
       if(userexist){
         console.log("hii")
         return res.status(401).send({suceess:false,message:"user already exist!"})
        }

       const hashpassword=await bcryptjs.hashSync(password,10)

       const newuser=new usermodel({    
        name:name,
        email:email,
        role:role,
        mobile:mobile,
        password:hashpassword,
        avatar:'avatars/'+ req.file.filename,
       })

       await newuser.save()

       if(hostel){
        const newhostel=new hostelmodel({
            name:hostel,
            email:email,
            location:location,
            floors:{
              "1":[]
            }
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

const updateroom = async (req, res) => {
  
  const { email, ogfloor, ogroom, newfloor, newroom, capacity, hostelers } = req.body;

  try {
    
    const hostel = await hostelmodel.findOne({ email });
    if (!hostel) {
      return res.status(404).json({ message: "Hostel not found" });
    }

    if (!hostel.floors.has(ogfloor)) {
      return res.status(404).json({ message: "Original floor not found" });
    }

    const ogFloorRooms = hostel.floors.get(ogfloor);

    const ogRoomIndex = ogFloorRooms.findIndex(r => r.number === parseInt(ogroom));
    if (ogRoomIndex === -1) {
      return res.status(404).json({ message: "Original room not found" });
    }

    const currentRoom = ogFloorRooms[ogRoomIndex];  //current room on og floor

    if (ogfloor !== newfloor) {             //the case when newfloor does not matches with ogfloor,
      if (!hostel.floors.has(newfloor)) {     //have to move that room to a new floor;
        hostel.floors.set(newfloor, []);
      }

      const newFloorRooms = hostel.floors.get(newfloor);

      const newRoomExists = newFloorRooms.some(r => r.number === parseInt(ogroom));  //the case when room with that ogroom no. already exist. nothing can be done now
      if (newRoomExists) {
        return res.status(400).json({ message: "Room number already exists on the new floor" });
      }

      newFloorRooms.push({
        number: newroom,
        capacity: capacity || currentRoom.capacity,
        hostelers: hostelers || currentRoom.hostelers,
      });

      ogFloorRooms.splice(ogRoomIndex, 1);

      hostel.floors.set(ogfloor, ogFloorRooms);
      hostel.floors.set(newfloor, newFloorRooms);
    } else {

      //the case when that room floor was not changed

      currentRoom.number = newroom || currentRoom.number;
      currentRoom.capacity = capacity || currentRoom.capacity;

      if (hostelers) {
        const newHostelerEmails = hostelers.map(h => h.email);

        currentRoom.hostelers = currentRoom.hostelers.filter(h =>
          newHostelerEmails.includes(h.email)
        );
        const existingEmails = currentRoom.hostelers.map(h => h.email);
        const newHostelers = hostelers.filter(
          h => !existingEmails.includes(h.email)
        );

        currentRoom.hostelers.push(...newHostelers);
      }

      ogFloorRooms[ogRoomIndex] = currentRoom;

      hostel.floors.set(ogfloor, ogFloorRooms);
    }
    await hostel.save();

    return res.status(200).json({
      message: "Room updated successfully",
      updatedRoom: currentRoom,
    });
  } catch (error) {
    console.error("Error updating room:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const announcement = async (req, res) => {
  const { email, message } = req.body;
  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    let annDoc = await annmodel.findOne({ email });

    if (!annDoc) {
      if (message) {
        annDoc = new annmodel({ email, messages: [{ text: message}] });
        await annDoc.save();
        return res.status(200).json({ announcements: annDoc.messages });
      } else {
        return res.status(404).json({ message: "No announcements found for this email" });
      }
    }

    if (message) {
      annDoc.messages.push({ text: message });
      await annDoc.save();
    }

    const sortedMessages = annDoc.messages.sort((a, b) => b.createdAt - a.createdAt); // Sort in descending order
    res.status(200).json({ announcements: sortedMessages });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "An error occurred", error: err });
  }
};

const complaints_reply=async(req,res)=>{
  try{
    const {To,from,message}=req.body;
    if(!To){
      return res.staus(400).json({message:"admin's email is required"});
    }
    const comp_reply=await complaint_replymodel.findOne({To});
    
    if(!comp_reply){
      return res.status(404).json({ message: "No Complaints found for You!" });
    }
    
    if(!from && !message){
      return res.status(200).json({suceess:true,comp_reply:comp_reply.messages});
    }
    else if(!from){
      return res.staus(400).json({message:"From: email was not found"});
    }
    else if(!message){
      return res.staus(400).json({message:"Message to be sent was not found"});
    }
    else{
      
      const hosteler = comp_reply.messages.find((hosteler) =>
        hosteler.email === from
      );
      
      if (!hosteler) {
        throw new Error(`Hosteler with email ${from} not found.`);
      }
      
      hosteler.messages.push({
        text: message,
        createdAt: new Date(),
      });
    
    await comp_reply.save();
    return res.status(200).json({
      success: true,
      message: "Message added successfully.",
      comp_reply:comp_reply.messages,
    });
  }
  }
  catch(err){
    res.status(500).json({ message: "An error occurred", error: err });
  }
}

const hostelfetch=async(req,res)=>{
  try {
    const hostels = await hostelmodel.find();

    const result = [];

    for (const hostel of hostels) {
      const admin = await usermodel.findOne({ email: hostel.email });

      if (admin) {
        result.push({
          hostel: {
            name: hostel.name,
            description: hostel.description,
            floors: hostel.floors,
          },
          admin: {
            name: admin.name,
            email: admin.email,
            mobile: admin.mobile,
          },
        });
      }
    }

    res.status(200).json({ hostels: result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "An error occurred while fetching hostels." });
  }
}

export {register,login,verify,finduser,addroomapi,findroom,findhostel,updatehostel,updateprofile,updateroom,announcement,complaints_reply,hostelfetch}