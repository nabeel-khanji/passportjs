var mongoose = require("mongoose");
const RoleSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
  },
  permissions: {
    role: {
      can_create: {
        type: Boolean,
      },
      can_read: {
        type: Boolean,
      },
      can_update: {
        type: Boolean,
      },
      can_delete: {
        type: Boolean,
      },
    },
    user: {
      can_create: {
        type: Boolean,
      },
      can_read: {
        type: Boolean,
      },
      can_update: {
        type: Boolean,
      },
      can_delete: {
        type: Boolean,
      },
    },
  },
  date: {
    type: Date,
    default: Date.now,
  },
});
const Role = mongoose.model("Role", RoleSchema);
module.exports = Role;
