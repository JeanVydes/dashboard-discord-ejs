const { color, resolve, getGuild, invite } = require("../../utils/misc");

let commandName = "ban";

module.exports = {
  name: commandName,
  category: "moderation",
  description: "Ban a user from your guild.",
  usage: "ban <member> [reason]",
  example: "ban @Member\nban @Member Bad People",
  aliases: ["oops"],
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
            description: "You need to tag guild member. `ban @Member [reason]`",
            color: c
          }
        }
      )
    }

    let member = await resolve(message, args[0])

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

    if (message.author.id === member.id) {
      return message.channel.createMessage({
        embed: {
          author: {
            name: "Member",
            icon_url: message.guild.iconURL
          },
          description: "Haha, Sorry but you can sanction yourself.",
          color: c
        }
      }
      )
    }

    if (member.id === bitch.user.id) {
      return message.channel.createMessage({
        embed: {
          author: {
            name: "Is Me!",
            icon_url: message.guild.iconURL
          },
          description: "I cannot sanction myself.",
          color: c
        }
      }
      )
    }

    if (member.roles.some(roles => guild.automoderator.ignored.includes(roles))) {
      return message.channel.createMessage({
        embed: {
          author: {
            name: "Member Moderator",
            icon_url: message.guild.iconURL
          },
          description: "You cannot sanction a moderator on the whitelist.",
          color: c
        }
      });
    }

    if (!(message.member.id === message.guild.ownerID || message.member.permission.has("administrator"))) {
      if (!message.member.highestRole.higherThan(member.highestRole)) {
        return message.channel.createMessage({
          embed: {
            author: {
              name: "Member Hight",
              icon_url: message.guild.iconURL
            },
            description: "You cannot sanction a member with a higher role than yours.",
            color: c
          }
        });
      }

      if (message.member.highestRole.position >= member.highestRole.position) {
        return message.channel.createMessage({
          embed: {
            author: {
              name: "Member Hight",
              icon_url: message.guild.iconURL
            },
            description: "You cannot sanction a member with a higher or equal role than yours.",
            color: c
          }
        });
      }
    }

    if (member.highestRole.higherThan(message.guild.me.highestRole)) {
      return message.channel.createMessage({
        embed: {
          author: {
            name: "Member Hight Me",
            icon_url: message.guild.iconURL
          },
          description: "My role is lower than that of this user, please put him on top of all the roles.",
          color: c
        }
      });
    }

    if (member.highestRole.position === message.guild.me.highestRole.position) {
      return message.channel.createMessage({
        embed: {
          author: {
            name: "Member Equals Me",
            icon_url: message.guild.iconURL
          },
          description: "My role is equal than that of this user, please put him on top of all the roles.",
          color: c
        }
      });
    }

    if (!member.punishable) {
      return message.channel.createMessage({
        embed: {
          author: {
            name: "Member Not Sanctionable",
            icon_url: message.guild.iconURL
          },
          description: "This member is not sanctionable.",
          color: c
        }
      });
    }

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

    await member.ban(7, reason);

    return message.channel.createMessage(
      {
        embed: {
          author: {
            name: "Ban",
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
              value: `<@${member.id}>`,
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
  }
}