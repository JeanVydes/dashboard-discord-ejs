const { color, updateU, getUser } = require("../../utils/misc");

let commandName = "myprefix";

module.exports = {
    name: commandName,
    category: "settings",
    description: "Setup personal prefixes.",
    usage: "myprefix <Add - Remove - List> <Prefix>",
    example: "myprefix add ! \nprefix remove ! \nprefix list",
    aliases: ["personalprefix", "myprefixes", "meprefix", "meprefixes"],
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

            if(newPrefix.toLowerCase() === "all"){
                return message.channel.createMessage(
                    {
                        embed: {
                            description: "Prohibited prefix.",
                            color: c
                        }
                    }
                );
            }

            let i = await getUser(message.author.id);
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

            await updateU(message.author.id, { $push: { "settings.prefixes": newPrefix}});
            
            return message.channel.createMessage(
                {
                    embed: {
                        description: `The prefix \`${newPrefix}\` has been pushed on your prefixes list.`,
                        color: c
                    }
                }
            );
        } else if(args[0].toLowerCase() === "remove"){
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
             
            if(oldPrefix.toLowerCase() === "all"){
                await updateU(message.author.id, { $set: { "settings.prefixes": [] }});

                return message.channel.createMessage(
                    {
                        embed: {
                            description: `All prefixes has been removed from your prefixes list.`,
                            color: c
                        }
                    }
                );
            }

            let i = await getUser(message.author.id);
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

            await updateU(message.author.id, { $pull: { "settings.prefixes": oldPrefix}});
            
            return message.channel.createMessage(
                {
                    embed: {
                        description: `The prefix \`${oldPrefix}\` has been removed from your prefixes list.`,
                        color: c
                    }
                }
            );
        } else if(args[0].toLowerCase() === "list"){
            let i = await getUser(message.author.id);
            let mapPrefixes = i.settings.prefixes.map(x => `- **${x}**`);
            if(mapPrefixes < 1){
                mapPrefixes = ["None."]
            }

            return message.channel.createMessage(
                {
                    embed: {
                        author: {
                            name: `Prefixes for ${message.author.username}`,
                            icon_url: message.author.avatarURL
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