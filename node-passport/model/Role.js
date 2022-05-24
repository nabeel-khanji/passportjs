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
      role_can_create: {
        type: Boolean,
      },
      role_can_read: {
        type: Boolean,
      },
      role_can_update: {
        type: Boolean,
      },
      role_can_delete: {
        type: Boolean,
      },
    },  user: {
        user_can_create: {
          type: Boolean,
        },
        user_can_read: {
          type: Boolean,
        },
        user_can_update: {
          type: Boolean,
        },
        user_can_delete: {
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
