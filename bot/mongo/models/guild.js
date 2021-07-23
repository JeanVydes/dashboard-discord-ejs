const { Schema, model } = require("mongoose");

const guildSchema = new Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    settings: {
        type: {},
        required: true,
        default: {
            prefixes: ["!"],
            color: 0xF1FFFF,
            ignored: [],
            premium: false,
            private_guild: false,
            autorole: {
              members: {
                status: false,
                role: null
              },
              bots: {
                status: false,
                role: null
              }
            },
            modules: {
                moderation: true,
                utility: true,
                music: true
            }
        }
    },
    automoderator: {
        type: {},
        required: true,
        default: {
            ignored: [],
            ignored_roles: [],
            bad: {
                status: false,
                words: [],
                ignored: [],
            },
            links: {
                status: false,
                ignored: [],
            },
            invites: {
                status: false,
                ignored: [],
            },
            mentions: {
                status: false,
                range: 5
            },
            emojis: {
                status : false,
                range: 5
            },
            images: {
                status: false,
                ignored: []
            },
            caps: {
                status: false,
                ignored: []
            },
            spam: {
                status: false,
                ignored: [],
                sensibility: 3,
            }
        }
    },
    tags: {
      type: [],
      require: true,
      default: []
    },
    embeds: {
      type: [],
      require: true,
      default: []
    }
});

module.exports = model("guild", guildSchema);