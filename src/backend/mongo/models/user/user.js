const { Schema, model } = require("mongoose");

const userSchema = new Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    guilds: {
      type: Array,
      required: true,
      default: []
    }
});

module.exports = model("user", userSchema);