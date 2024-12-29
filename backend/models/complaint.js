import mongoose from "mongoose";

const projectdb = mongoose.connection.useDb("project_hostel");

const complaint_replyschema = new mongoose.Schema(
  {
    To: {
      type: String,
      required: true,
      unique: true,
    },
    messages: {
      type: [
        {
          email: { type: String, required: true },
          name:{ type: String, required: true},
          messages: [
            {
              text: { type: String, required: true },
              type: { type: String, required: true, enum: ["reply", "complaint"],default:"reply"},
              createdAt: { type: Date, default: Date.now },
            },
          ],
        },
      ],
      default: [],
    },
  },
  { timestamps: true }
);

const complaint_replymodel = projectdb.model("complaints_reply", complaint_replyschema);

export default complaint_replymodel;
