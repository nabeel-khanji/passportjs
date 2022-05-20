var mongoose = require('mongoose');
const RoleSchema= mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    slug:{
        type:String,
        required:true
    },
  date:{
        type:Date,
        default:Date.now
    }, 
});
const Role = mongoose.model("Role",RoleSchema);
module.exports=Role;
