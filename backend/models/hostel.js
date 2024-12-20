import mongoose from "mongoose";

const projectdb = mongoose.connection.useDb('project_hostel');

const roomschema = new mongoose.Schema({
    number: {
      type: Number,
      required: true,
      unique: true,
    },
    capacity: {
      type: Number,
      required: true,
      min: 1,
    },
    hostelers: [
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
    email: {
        type: String,
        required: true,
        unique: true
    },
    floors: {
        type: Map,
        of: [roomschema],
        default:{}
    }
}, { timestamps: true });

const hostelmodel = projectdb.model('hostels', hostelschema);

export default hostelmodel;
