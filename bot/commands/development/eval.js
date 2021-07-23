const { format,
    getUser,
    getGuild,
    random,
    color,
    stats,
    addGuild,
    removeGuild,
    addUser,
    removeUser,
    userPrefixes,
    guildPrefixes,
    unique,
    updateG,
    updateU,
    resolve,
    resolveC,
    getID,
    today,
    getDate,
    coinName,
    invite,
    support,
    regexToMatchEmojis,
    emojis
} = require("../../utils/misc");
const { c, inspect } = require("../../utils/require");
const humanizeDuration = require("humanize-duration");
const fetch = require("node-fetch");
const mongoose = require("mongoose");

let commandName = "eval";

module.exports = {
    name: commandName,
    category: null,
    description: null,
    usage: null,
    example: null,
    aliases: ["e"],
  run: async function run(client, message, args) {
        if(message.author.id !== c.owner[0]) return;

        const clean = text => {
        if (typeof(text) === "string")
            return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
        else
            return text;
        }

        try {
        let code = args.join(" ");
        let evaled = eval(code);
    
        if (typeof evaled !== "string")
            evaled = await inspect(evaled, { depth: 0 });

        if(clean(evaled).length > 6000){
          console.log(clean(evaled))
          evaled = `Exceded Embed Limits: Check Console. (${clean(evaled).length} Characters)`
        }

        if(["client.token", "client.token", "process.env", "c"].includes(code.toLowerCase())){
          code = "Me gusta free fire 🥵🤑"
          evaled = `No me sorprende.`
        }

        message.channel.createMessage(
            {
                embed: {
                    author: {
                        name: "Evaluation",
                        icon_url: client.user.avatarURL
                    },
                    fields: [
                        {
                        name: "Input",
                        value: `\`\`\`js\n${code}\n\`\`\``,
                        inline: true
                        }
                    ],
                    description: `**Output** \n\`\`\`js\n${clean(evaled)}\n\`\`\``,
                    color: await color(message.guild.id)
                }
            }
            )
        } catch (err) {
        message.channel.createMessage(
            {
                embed: {
                    author: {
                    name: "Evaluation (ERROR)",
                    icon_url: client.user.avatarURL
                    },
                    fields: [
                    {
                        name: "Output",
                        value: `\`\`\`xl\n${clean(err)}\n\`\`\``,
                        inline: true
                    }
                    ],
                    color: await color(message.guild.id)
                }
            }
        )
        }
    }
}