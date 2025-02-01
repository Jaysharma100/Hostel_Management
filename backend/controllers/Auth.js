import usermodel from "../models/user.js"
import hostelmodel from "../models/hostel.js"
import annmodel from "../models/announcement.js"
import bcryptjs from "bcryptjs"
import jwt from "jsonwebtoken"
import fs from "fs"
import complaint_replymodel from "../models/complaint.js"
import redis from "../utils/redis.js"

const register=async(req,res)=>{
    try{
       const {name,email,role,password,hostel,mobile,location}=req.body

       const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
       const isValidEmail =emailRegex.test(email);
       if(isValidEmail==false){
        return res.status(400).send({suceess:false,message:"Incorrect email format!"})
       }
        
       const userexist=await usermodel.findOne({email});
       if(userexist){
         return res.status(401).send({suceess:false,message:"user already exist!"})
        }

        const avatarPath = req.file ? 'avatars/' + req.file.filename : 'avatars/default_avatar.jpg';

       const hashpassword=await bcryptjs.hashSync(password,10)

       const newuser=new usermodel({    
        name:name,
        email:email,
        role:role,
        mobile:mobile,
        password:hashpassword,
        avatar:avatarPath,
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
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isValidEmail =emailRegex.test(email);
        if(isValidEmail==false){
          return res.status(400).send({suceess:false,message:"Incorrect email format!"})
        }
        
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

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isValidEmail =emailRegex.test(email);
  if(isValidEmail==false){
    return res.status(400).send({suceess:false,message:"Incorrect email format!"})
  }

  try {
      const user = await usermodel.findOne({ email });

      if (!user) {
          return res.status(404).json({ success: false, message: "User not found!" });
      }

      if (req.file) {
          // Remove old avatar if exists
          if (user.avatar && fs.existsSync(user.avatar) && user.avatar!=="avatars/default_avatar.jpg") {
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
  const { email, message, justcheck} = req.body;
  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    let annDoc = await annmodel.findOne({ email });

    if(justcheck===1){
      return res.status(200).json({success:true,announcements:annDoc});
    }

    if (!annDoc) {
      if (message) {
        annDoc = new annmodel({ email, messages: [{ text: message}] });
        await annDoc.save();
        return res.status(200).json({ announcements: annDoc.messages });
      } else {
        return res.status(200).json({ announcements:[]});
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
    const {To,from,message,type}=req.body;
    if(!To){
      return res.staus(400).json({message:"admin's email is required"});
    }
    const comp_reply=await complaint_replymodel.findOne({To});
    
    if(!comp_reply && message){
      const newComplaint = new complaint_replymodel({
        To: To,
        messages: [{
          email: from,
          name: req.body.name || from,
          messages: [{
            text: message,
            type: type,
            createdAt: new Date()
          }]
        }]
      });
      await newComplaint.save();
      const hosteler = newComplaint.messages.find(h => h.email === from);
      return res.status(200).json({
        success: true,
        message: "Complaint registered successfully",
        comp_reply: hosteler ? hosteler.messages.reverse() : []
      });
    }
    else if(!comp_reply){
      return res.status(404).json({ message: "No Complaints found for You!" });
    }
    
    if(!from && !message){
      return res.status(200).json({suceess:true,comp_reply:comp_reply.messages});
    }
    else if(!from){
      return res.staus(400).json({message:"From: email was not found"});
    }
    else if(!message){
      const comprepfound = comp_reply.messages.find((hosteler) => hosteler.email === from);

      if (!comprepfound) {
        return res.status(404).json({
          message: `No complaints found for the provided email: ${from}`,
        });
      }

      return res.status(200).json({
        success: true,
        messages: comprepfound.messages.reverse(),
      });
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
        type: type,
        createdAt: new Date(),
      });
    
    await comp_reply.save();
    return res.status(200).json({
      success: true,
      message: "Message added successfully.",
      comp_reply:type==="reply"?comp_reply.messages:hosteler.messages.reverse(),
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
            location: hostel.location
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

const measureMONGODB_time=async(req,res)=>{
  const { email, floorNumber, roomNumber } = req.body;

    try {
        const startTime = Date.now(); // Record the time when the request starts

        const hostel = await hostelmodel.findOne({email});
        if (!hostel) return res.status(404).send({ message: "Hostel not found" });
        console.log(hostel);
        
        // console.log(hostel.floors.get(floorNumber));
        const room = hostel.floors.get(floorNumber)?.find(r => r.number === roomNumber);
        if (!room) return res.status(404).send({ message: "Room not found" });

        if (room.flag !== 0){
          room.flag = 0;
        room.flagUpdatedAt = new Date();

        await hostel.save();
          return res.status(400).send({ message: "Room is already in use" });
        }

        room.flag = 1;
        room.flagUpdatedAt = new Date();

        await hostel.save();

        const endTime = Date.now(); // Record the time after the database update
        const timeDifference = (endTime - startTime); // Time in milliseconds

        res.status(200).send({
            message: "Flag updated to 1",
            timeDifference: `${timeDifference} ms`,
        });
    } catch (error) { 
        console.error(error);
        res.status(500).send({ message: "Internal server error" });
    }
}

const measureRedisTime = async (req, res) => {
  const { email, floorNumber, roomNumber, ttl } = req.body;

  try {
    const startTime = Date.now();

    const uniqueKey = `${email}_${floorNumber}_${roomNumber}`;

    const keyExists = await redis.exists(uniqueKey);
    if (keyExists) {
      return res.status(409).json({message:"room already in use"});
    }

    await redis.set(uniqueKey, 1, 'EX', ttl);

    const timeDifference = Date.now() - startTime;

    res.status(200).send({
      timeDifference: `${timeDifference} ms`,
    });
  } catch (error) {
    console.error("Error setting key in Redis:", error);
    res.status(500).send({ message: "Internal server error" });
  }
};

const lockroom=async(req,res)=>{
  const {email,floorNumber,roomNumber,isopen}=req.body;
  
  try{
    const uniqueKey = `${email}_${floorNumber}_${roomNumber}`;

    const keyExists = await redis.exists(uniqueKey);

    if(isopen){
      if(keyExists)
      redis.del(uniqueKey);
      return res.status(200).json({success:true,message:"done closing",open:0})
    }
    if (keyExists) {
      return res.status(409).json({message:"Unknown Error"});
    }
    await redis.set(uniqueKey, 1, 'EX', 3);
    return res.status(200).json({success:true,message:"Go Ahead, Complete Booking!",open:1})
  }
  catch(err){
    return res.status(500).json({success:false,message:"Internal server Error",err});
  }
}

const bookroom= async(req,res)=>{
  const {email,floorNumber,roomNumber,user_email,justcheck}=req.body;
  try{
    const allHostels = await hostelmodel.find({});
    for (const hostel of allHostels) {
      for (const [floor, rooms] of hostel.floors.entries()) {
        for (const room of rooms) {
          if (room.hostelers.some(hosteler => hosteler.email === user_email)) {
            if(justcheck && justcheck===1){
              const admin=await usermodel.findOne({email:hostel.email});
              return res.status(200).json({suceess:true,room:room,floor:floor,hostel:hostel.name,admin:admin});
            }
            return res.status(400).json({
              message: `Already in a hostel: ${hostel.name}. Leave the hostel using your room page first.`,
            });
          }
        }
      }
    }

    if(justcheck===1){
      return res.status(404).json({suceess:true,message:"Get yourself a room by browsing them at hostels"});
    }

    const uniqueKey = `${email}_${floorNumber}_${roomNumber}`;
    await redis.del(uniqueKey);

    const hostel = await hostelmodel.findOne({ email });
    if (!hostel) {
      return res.status(404).json({ message: "Hostel not found" });
    }

    const hostelfloor = hostel.floors.get(floorNumber);
    if (!hostelfloor) {
      return res.status(404).json({ message: "Floor not found" });
    }

    const roomIndex = hostelfloor.findIndex(r => r.number === parseInt(roomNumber));
    if (roomIndex === -1) {
      return res.status(400).json({ message: "Room number does not exist on the floor" });
    }

    const room = hostelfloor[roomIndex];
    if (room.hostelers.length >= room.capacity) {
      return res.status(400).json({ message: "Room is already full" });
    }

    room.hostelers.push({ email: user_email });
    hostel.floors.set(floorNumber, hostelfloor);

    await hostel.save();

    return res.status(200).json({
      success: true,
      message: "Room booked successfully",
    });
  }
  catch(err){
    return res.status(500).json({success:false,message:"Internal server Error",err});
  }
}

const leaveroom=async(req,res)=>{
  const {user_email,hostel_email,floor,room}=req.body;
  try{
    
    const hostel=await hostelmodel.findOne({email:hostel_email});
    if(!hostel){
      return res.status(404).json({ message: "Hostel not found" });
    }
    const floorRooms = hostel.floors.get(floor);
    if (!floorRooms) {
      return res.status(404).json({ message: "Floor not found" });
    }

    const roomData = floorRooms.find((r) => r.number === room);
    if (!roomData) {
      return res.status(404).json({ message: "Room not found" });
    }

    const updatedHostelers = roomData.hostelers.filter(
      (hosteler) => hosteler.email !== user_email
    );
    roomData.hostelers = updatedHostelers;

    await hostel.save();

    return res.status(200).json({ success: true, message: "User removed from room" });
  }
  catch(err){
    return res.status(500).json({success:false,message:"Internal server Error",err});
  }
}

export {register,login,verify,finduser,addroomapi,findroom,findhostel,updatehostel,updateprofile,updateroom,announcement,complaints_reply,hostelfetch,measureMONGODB_time,measureRedisTime,lockroom,bookroom,leaveroom}