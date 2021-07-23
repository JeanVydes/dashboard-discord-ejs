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
    },
    settings: {
        type: {},
        required: true,
        default: {
            prefixes: [],
        }
    },
    stats: {
        type: {},
        required: true,
        default: {
            client: {
                messages: 0,
                commands: 0
            }
        }
    },
    badges: {
        type: {},
        required: true,
        default: {
            member: false,
            verified: false,
            partner: false,
            youtuber: false,
            streamer: false,
            discord_staff: false,
            early_support: false,
            events: false,
            donator: false,
            booster: false,
            ultra_secret: false,
            support: false,
            moderator: false,
            administrator: false,
            developer: false,
            ceo: false
        }
    },
    profile: {
        type: {},
        required: true,
        default: {
            description: "",
            country: null,
            website: null
        }
    }
});

module.exports = model("user", userSchema);