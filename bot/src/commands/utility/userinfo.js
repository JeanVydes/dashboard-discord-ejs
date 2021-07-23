const { color, resolve, getGuild, getDate } = require("../../utils/misc");

let commandName = "userinfo";

module.exports = {
  name: commandName,
  category: "utility",
  description: "Get utility info about a member guild.",
  usage: "userinfo <member>",
  example: "userinfo @Member",
  aliases: ["u", "user"],
  run: async function run(bitch, message, args) {

    let guild = await getGuild(message.guild.id);
    let c = await color(message.guild.id);

    if (!guild.settings.modules.utility) {
      return message.channel.createMessage(
        {
          embed: {
            author: {
              name: "Unavailable Module",
              icon_url: message.guild.iconURL
            },
            description: "This modules is deactivated.",
            color: c
          }
        }
      )
    }

    let member;

    if(args[0]){
      member = await resolve(message, args.join(" "))
      if (!member) {
        return message.channel.createMessage(
          {
            embed: {
              author: {
                name: "Member",
                icon_url: message.guild.iconURL
              },
              description: "I couldn't find this member in the current guild.",
              color: c
            }
          }
        )
      }
    } else {
      member = message.guild.members.find(e => e.id === message.author.id);
    }

    let options = { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' };
    let now = new Date();

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
          name: member.username,
          icon_url: member.avatarURL
        },
        fields: [
          {
            name: "User ID",
            value: member.id,
            inline: false
          },
          {
            name: "Username",
            value: member.username,
            inline: true
          },
          {
            name: "Nickname",
            value: member.nick ? member.nick : "None",
            inline: true
          },
          {
            name: "Is Bot",
            value: member.bot ? "Yes" : "Not",
            inline: true
          },
          {
            name: "Created",
            value: await getDate(member.createdAt),
            inline: true
          },
          {
            name: "Joined",
            value: await getDate(member.joinedAt),
            inline: true
          },
          {
            name: "Boosting Since",
            value: member.premiumSince ? await getDate(member.premiumSince) : "No Boosting",
            inline: true
          },
          {
            name: "Activity",
            value: member.game ? `${member.game.name}` : "None",
            inline: true
          },
          {
            name: "Highest Role",
            value: member.highestRole.name != "@everyone" ? `<@&${member.highestRole.id}>` : "None"
          },
          {
            name: "Roles",
            value: member.roles.length > 1 ? member.roles.map(role => `<@&${role}>`).join(", ") : "None",
            inline: false
          },
          {
            name: "Avatar",
            value: `[URL](${member.avatarURL})`
          }
        ],
        thumbnail: {
          url: member.avatarURL
        },
        color: c
      }
    })
  }
}