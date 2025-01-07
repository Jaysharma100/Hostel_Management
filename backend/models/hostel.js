import mongoose from "mongoose";

const projectdb = mongoose.connection.useDb('project_hostel');

const roomschema = new mongoose.Schema({
    number: {
      type: Number,
      required: true,
    },
    capacity: {
      type: Number,
      required: true,
      min: 1,
    },
    flag:{
      type:Number,
      default:0
    },
    flagUpdatedAt:{
      type:Date,
      default:Date.now
    },
    hostelers:[
      {
        email: {
          type: String,
          required: true,
          unique: true,
        },
        joinedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
},{ timestamps: true });
  

const hostelschema = new mongoose.Schema({
    name:{
      type:String,
      required:true
    },
    description:{
      type:String,
      default:""
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    location:{
      type:String,
      default:""
    },
    floors: {
        type: Map,
        of: [roomschema],
        default:{}
    }
}, { timestamps: true });

hostelschema.index({ 'floors.floorNumber': 1 }, { unique: true, sparse: true });

const hostelmodel= projectdb.model('hostels', hostelschema);

export default hostelmodel;
