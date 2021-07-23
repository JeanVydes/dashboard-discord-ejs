const { color, getGuild, format, invite } = require("../../utils/misc");
const newCooldown = new Map();

let commandName = "purge";

module.exports = {
    name: commandName,
    category: "moderation",
    description: "Clean up your chat.",
    usage: "purge <lines>",
    example: "purge 100",
    aliases: ["clear"],
    run: async function run(bitch, message, args) {

        let channel = message.channel.id

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

        if (!message.guild.me.permission.has("manageMessages")) {
            return message.channel.createMessage(
                {
                    embed: {
                        author: {
                            name: "Permissions Me",
                            icon_url: message.guild.iconURL
                        },
                        description: `I not have \`Manage Messages\` permissions. Please re-invite me with [this link](${invite})`,
                        color: c
                    }
                }
            )
        }

        if (!(message.member.permission.has("manageMessages") || message.member.roles.some(roles => guild.automoderator.ignored_roles.includes(roles)))) {
            return message.channel.createMessage(
                {
                    embed: {
                        author: {
                            name: "Permissions",
                            icon_url: message.guild.iconURL
                        },
                        description: "You not have `Manage Messages` permissions or moderator role.",
                        color: c
                    }
                }
            )
        }

      const cooldown = newCooldown.get(message.author.id);
      if (cooldown) {
        return message.channel.createMessage(
          {
            embed: {
              description: `Do you wait **${format(cooldown - Date.now())}** to ${this.name} again.`,
              color: c
            }
          }
        )
      } else {
        let lines = args[0];
        if (!lines) {
            return message.channel.createMessage(
                {
                    embed: {
                        author: {
                            name: "Lines",
                            icon_url: message.guild.iconURL
                        },
                        description: "You have to specify a number of lines. `Max 900 - Min 2`",
                        color: c
                    }
                }
            )
        }
        
        if(isNaN(lines)){
          return message.channel.createMessage(
                {
                    embed: {
                        author: {
                            name: "Lines",
                            icon_url: message.guild.iconURL
                        },
                        description: "You have to use numbers to specify the number lines to purge.",
                        color: c
                    }
                }
            )
        }
        
        if(lines > 900 || lines < 2){
          return message.channel.createMessage(
                {
                    embed: {
                        author: {
                            name: "Lines",
                            icon_url: message.guild.iconURL
                        },
                        description: "The Max purge per command is **900** lines and Min is **2**.",
                        color: c
                    }
                }
            )
        }

        async function clear(channel, lines) {
          let count;
          function asign(counting) {
            count = counting;
          }
          await bitch.purgeChannel(channel, lines).then(total => asign(total));
          return count
        }

        try {
          let linesCleared = 0;
          if(lines > 299 && lines < 601) {
            let linesCleared = 0;
            linesCleared += await clear(channel, Math.floor(lines/2));
            linesCleared += await clear(channel, Math.floor(lines/2));
          } else if(lines > 599 && lines < 901) {
            linesCleared += await clear(channel, Math.floor(lines/3));
            linesCleared += await clear(channel, Math.floor(lines/3));
            linesCleared += await clear(channel, Math.floor(lines/3));
          } else if(lines > 1 && lines < 301) {
            linesCleared += await clear(channel, lines);
          }

          message.channel.createMessage({
            embed: {
              description: `**${linesCleared}** Messages purged from this channel.`,
              footer: {
                text: "This message will be deleted in 5 seconds."
              },
              color: c
            }
          }).then((msg) => { setTimeout(() => {
              msg.delete({ timeout: 5000});
            });
          });

          newCooldown.set(message.author.id, Date.now() + 15000);
          setTimeout(() => newCooldown.delete(message.author.id), 15000);
        } catch (err) {
          console.log(err)
            return message.channel.createMessage(
                {
                    embed: {
                        author: {
                            name: "Error",
                            icon_url: message.guild.iconURL
                        },
                        description: err,
                        color: c
                    }
                }
            )
        }
      }
    }
}