const { color, updateG, getGuild } = require("../../utils/misc");

let commandName = "prefix";

module.exports = {
    name: commandName,
    category: "settings",
    description: "Setup the global guild prefixes.",
    usage: "prefix <Add - Remove - List> <Prefix>",
    example: "prefix add ! \nprefix remove ! \nprefix list",
    aliases: ["globalprefix"],
    run: async function run(bitch, message, args) {
        let c = await color(message.guild.id);

        if(!args[0]){
            return message.channel.createMessage(
                {
                    embed: {
                        description: "You need to identify the next argument. `add` | `remove` | `list`",
                        color: c
                    }
                }
            );
        }

        if(args[0].toLowerCase() === "add"){
          if(!message.member.hasPermission("manageGuild" || "administrator")){
              return message.channel.createMessage(
                  {
                      embed: {
                          description: "You need to have permissions to execute this command. `manageGuild` or `administrator`",
                          color: c
                      }
                  }
              );
          }
            let newPrefix = args[1];
            if(!newPrefix){
                return message.channel.createMessage(
                    {
                        embed: {
                            description: "You need to identify the new prefix.",
                            color: c
                        }
                    }
                );
            }

            if(newPrefix.length < 1){
                return message.channel.createMessage(
                    {
                        embed: {
                            description: "This prefix is very short.",
                            color: c
                        }
                    }
                );
            }

            if(newPrefix.length > 100){
                return message.channel.createMessage(
                    {
                        embed: {
                            description: "This prefix is very long.",
                            color: c
                        }
                    }
                );
            }

            let i = await getGuild(message.guild.id);
            if(i.settings.prefixes.includes(newPrefix)){
                return message.channel.createMessage(
                    {
                        embed: {
                            description: "This is already a prefix.",
                            color: c
                        }
                    }
                );
            }

            await updateG(message.guild.id, { $push: { "settings.prefixes": newPrefix}});
            
            return message.channel.createMessage(
                {
                    embed: {
                        description: `The prefix \`${newPrefix}\` has been pushed on the prefixes list.`,
                        color: c
                    }
                }
            );
        } else if(args[0].toLowerCase() === "remove"){
          if(!message.member.hasPermission("manageGuild" || "administrator")){
              return message.channel.createMessage(
                  {
                      embed: {
                          description: "You need to have permissions to execute this command. `manageGuild` or `administrator`",
                          color: c
                      }
                  }
              );
          }
            let oldPrefix = args[1];
            if(!oldPrefix){
                return message.channel.createMessage(
                    {
                        embed: {
                            description: "You need to identify the prefix.",
                            color: c
                        }
                    }
                );
            }

            let i = await getGuild(message.guild.id);
            if(!i.settings.prefixes.includes(oldPrefix)){
                return message.channel.createMessage(
                    {
                        embed: {
                            description: "This prefix does not exist.",
                            color: c
                        }
                    }
                );
            }

            await updateG(message.guild.id, { $pull: { "settings.prefixes": oldPrefix}});
            
            return message.channel.createMessage(
                {
                    embed: {
                        description: `The prefix \`${oldPrefix}\` has been removed from the prefixes list.`,
                        color: c
                    }
                }
            );
        } else if(args[0].toLowerCase() === "list"){
            let i = await getGuild(message.guild.id);
            let f = i.settings.prefixes;
            let mapPrefixes = f.map(x => `- **${x}**`);
            if(mapPrefixes < 1){
                mapPrefixes = ["None."]
            }

            return message.channel.createMessage(
                {
                    embed: {
                        author: {
                            name: `Prefixes for ${message.guild.name}`,
                            icon_url: message.guild.iconURL
                        },
                        description: mapPrefixes.join(" \n"),
                        color: c
                    }
                }
            );
        } else {
            return message.channel.createMessage(
                {
                    embed: {
                        description: "You need to identify the next argument. `add` | `remove` | `list`",
                        color: c
                    }
                }
            );
        }
    }
};