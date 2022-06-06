import mongoose from "mongoose";
const RouteSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  route: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});
const Route = mongoose.model("Route", RouteSchema);
export default Route;
