var mongoose = require("mongoose");
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
const Report = mongoose.model("Report", ReportSchema);
module.exports = Report;
