const { color, resolve, getGuild, today } = require("../../utils/misc");

let commandName = "botinfo";

module.exports = {
  name: commandName,
  category: null,
  description: "Get utility info about of Jean Bot.",
  usage: "botinfo",
  example: "botinfo",
  aliases: ["bi", "info"],
  run: async function run(bitch, message, args) {

    if(message.author.id !== "525842461655040011") return;

    let guild = await getGuild(message.guild.id);
    let c = await color(message.guild.id);
    
    let status = {
      online: "<:online:736381873491804181> Online",
      idle: "<:idle:736391076755144824> AFK",
      dnd: "<:dnd:736381873491804181> Do not Disturb",
      streaming: "<:streaming:736381873328226365> Streaming",
      offline: "<:offline:736381873470701608> Offline"
    }

    return message.channel.createMessage({
      embed: {
        author: {
          name:bitch.user.username,
          icon_url: bitch.user.avatarURL
        },
        fields: [
          {
            name: "ID",
            value: bitch.user.id,
            inline: true
          },
          {
            name: "Username",
            value: bitch.user.username,
            inline: true
          },
          {
            name: "Connection",
            value: `**${Date.now() - message.timestamp}**ms`,
            inline: true
          },
          {
            name: "Shards",
            value: bitch.shards.size,
            inline: true
          },
          {
            name: "Memory",
            value: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}mb`,
            inline: true
          },
          {
            name: "Guilds",
            value: bitch.guilds.size,
            inline: true
          },
          {
            name: "Users",
            value: bitch.users.size,
            inline: true
          },
        ],
        color: c
      }
    })
  }
}