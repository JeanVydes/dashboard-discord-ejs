const { color, getGuild, invite } = require("../../utils/misc");

let commandName = "unban";

module.exports = {
  name: commandName,
  category: "moderation",
  description: "Unban a user from the guild.",
  usage: "softban <member> [reason]",
  example: "softban @Member\nsoftban @Member Bad People",
  aliases: ["unban"],
  run: async function run(bitch, message, args) {

    let guild = await getGuild(message.guild.id);
    let c = await color(message.guild.id);

    if (!guild.settings.modules.moderation) {
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

    if(!message.guild.me.permission.has("banMembers")){
      return message.channel.createMessage(
        {
          embed: {
            author: {
              name: "Permissions Me",
              icon_url: message.guild.iconURL
            },
            description: `I not have \`Ban Members\` permissions. Please re-invite me with [this link](${invite})`,
            color: c
          }
        }
      )
    }

    if (!(message.member.permission.has("banMembers") || message.member.roles.some(roles => guild.automoderator.ignored_roles.includes(roles)))) {
      return message.channel.createMessage(
        {
          embed: {
            author: {
              name: "Permissions",
              icon_url: message.guild.iconURL
            },
            description: "You not have `Ban Members` permissions or moderator role.",
            color: c
          }
        }
      )
    }

    if (!args[0]) {
      return message.channel.createMessage(
        {
          embed: {
            author: {
              name: "Member",
              icon_url: message.guild.iconURL
            },
            description: "You need to tag a user or provide a user ID. `unban`",
            color: c
          }
        }
      )
    }

    const idMatcher = /^([0-9]{15,21})$/;

    const memberID = args[0].match(idMatcher);

    let reason = args.slice(1).join(" ");
    if (reason.length > 150) {
      return message.channel.createMessage({
        embed: {
          author: {
            name: "Reason",
            icon_url: message.guild.iconURL
          },
          description: "This reason is so long.",
          color: c
        }
      }
      )
    }
    if (!reason) reason = "None reason.";

    try {
      await message.guild.unbanMember(`${memberID[0]}`);
      return message.channel.createMessage(
        {
          embed: {
            author: {
              name: "UnBan",
              icon_url: message.guild.iconURL
            },
            fields: [
              {
                name: "Moderator",
                value: `<@${message.author.id}>`,
                inline: true
              },
              {
                name: "User",
                value: `<@${memberID[0]}>`,
                inline: true
              },
              {
                name: "Reason",
                value: `${reason}`,
                inline: true
              }
            ],
            color: c
          }
        }
      )
    } catch {
      return message.channel.createMessage(
        {
          embed: {
            description: "I couldn't find this member in the ban list."
          }
        }
      )
    }
  }
}