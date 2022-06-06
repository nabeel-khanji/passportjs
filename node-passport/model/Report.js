import mongoose from "mongoose";
const ReportSchema = mongoose.Schema({
  route: {
    type: String,
    required: true,
  },
 
  date: {
    type: Date,
    default: Date.now,
  },
});
const Report =mongoose. model("Report", ReportSchema);
export default Report;
