const { color, updateG } = require("../../utils/misc");

let commandName = "color";

module.exports = {
    name: commandName,
    category: "settings",
    description: "Setup the global color for the guild.",
    usage: "color <Hex Color>",
    example: "color f1f1f1",
    aliases: ["setcolor"],
    run: async function run(bitch, message, args) {
        let c = await color(message.guild.id);
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

        if(!args[0]){
            return message.channel.createMessage(
                {
                    embed: {
                        description: "You need to give a hex color.",
                        color: c
                    }
                }
            );
        }

        let check = /[0-9A-Fa-f]{6}/g;
        if(check.test(args[0])){
            let x = parseInt(args[0], 16)
            await updateG(message.guild.id, {$set: {"settings.color": x}})
            return message.channel.createMessage(
                {
                    embed: {
                        description: `The color #${args[0]} has been set correctly.`,
                        thumbnail: {
                            url: `https://api.alexflipnote.dev/color/image/${args[0]}`
                        },
                        color: x
                    },
                }
            );
        } else {
            return message.channel.createMessage(
                {
                    embed: {
                        description: "You can only use HEX, you can choose your color [here](https://htmlcolorcodes.com/en/).",
                        color: c
                    }
                }
            );
        }
    }
};