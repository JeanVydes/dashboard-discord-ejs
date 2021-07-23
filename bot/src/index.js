const Sharder = require("eris-sharder").Master;
const cluster = require("cluster");
const c = require("../config");

require("../src/mongo/connect");

const init = async () => {
    if(cluster.isMaster) {
        try { 
            require("./auth.json");
            throw new Error("outdated");
        } catch(e) { 
            if(e.message == "outdated") throw new Error("auth.json is outdated, please use the .env file instead! See the github page for more info");
        }
    }

    let sharder = new Sharder(process.env.TOKEN, '/src/main', {
        clientOptions: {
            disableEvents: {
              GUILD_UPDATE: true,
              CHANNEL_CREATE: true,
              CHANNEL_UPDATE: true,
              CHANNEL_DELETE: true,
              CHANNEL_OVERWRITE_CREATE: true,
              CHANNEL_OVERWRITE_UPDATE: true,
              CHANNEL_OVERWRITE_DELETE: true,
              MEMBER_KICK: true,
              MEMBER_PRUNE: true,
              MEMBER_BAN_ADD: true,
              MEMBER_BAN_REMOVE: true,
              MEMBER_UPDATE: true,
              MEMBER_ROLE_UPDATE: true,
              MEMBER_MOVE: true,
              MEMBER_DISCONNECT: true,
              BOT_ADD: false,
              ROLE_CREATE: true,
              ROLE_UPDATE: true,
              ROLE_DELETE: true,
              INVITE_CREATE: true,
              INVITE_UPDATE: true,
              INVITE_DELETE: true,
              WEBHOOK_CREATE: true,
              WEBHOOK_UPDATE: true,
              WEBHOOK_DELETE: true,
              EMOJI_CREATE: true,
              EMOJI_UPDATE: true,
              EMOJI_DELETE: true,
              MESSAGE_DELETE: false,
              MESSAGE_BULK_DELETE: false,
              MESSAGE_PIN: true,
              MESSAGE_UNPIN: true,
              MESSAGE_CREATE: false,
              MESSAGE_REACTION_ADD: false,
              MESSAGE_REACTION_REMOVE: true,
              INTEGRATION_CREATE: true,
              INTEGRATION_UPDATE: true,
              INTEGRATION_DELETE: true
            },
            allowedMentions: {
                everyone: true,
                roles: true,
                users: true
            },
            restMode: true,
            messageLimit: 300,
            autoreconnect: true,
            setMaxListeners: 0,
            defaultImageFormat: "png",
            compress: true,
            guildSubscriptions: false,
            //intents: 591,
            requestTimeout: 20000,
            intents: 1795
        },
        stats: false,
        clusters: 1,
        shards: 2,
        //guildsPerShard: 500,
        debug: true,
        name: 'Jean',
        webhooks: c.webhooks
    });
}

init();