const { color } = require("../../utils/misc");

let commandName = "help";

module.exports = {
    name: commandName,
    category: "other",
    description: "Get all get help.",
    usage: "help [Modules - Command Name]",
    example: "help\nhelp modules\nhelp color",
    aliases: ["ayuda"],
    run: async function run(bitch, message, args) {
        let c = await color(message.guild.id);
            let x = args[0]
            if(!x) x = "null";
            let cmd = bitch.commands.get(args[0]) || bitch.commands.find(cmd => cmd.aliases && cmd.aliases.includes(args[0]));
            if(!args[0]){
                message.channel.createMessage(
                    {
                    embed: {
                        author: {
                            name: bitch.user.username + " Help",
                            icon_url: bitch.user.avatarURL
                        },
                        description: `Hello <@!${message.author.id}>, welcome to the help menu, Here you can find all the help you need.`,
                        color: c,
                        fields: [
                            {
                                name: "Help Commands",
                                value: "`help` \n`help modules` \n`help <commandName>`",
                                inline: true
                            },
                            {
                              name: "Support",
                              value: "https://discord.gg/ptJXWU7",
                              inline: true
                            },
                            {
                                name: "More",
                                value: "**[Dashboard](https://aqskqeak.glitch.me/)** \n[Invite](https://discord.com/oauth2/authorize?scope=bot&response_type=code&redirect_uri=http%3A%2F%2Faqskqeak.glitch.me%2F&permissions=943189247&client_id=732305355819843615)",
                                inline: true
                            },
                        ]
                    }
                    }
                );
            } else if(cmd) {
                message.channel.createMessage(
                    {
                    embed: {
                        author: {
                            name: bitch.user.username + " Help",
                            icon_url: bitch.user.avatarURL
                        },
                        description: `**Name** \`${cmd.name || "?"}\` \n**Description** \`${cmd.description || "None"}\` \n**Category** \`${cmd.category || "Other"}\` \n**Usage** \`${cmd.usage || "None"}\` \n**Aliases** \`${cmd.aliases !== 0 ? cmd.aliases.join(", ") : "No aliases"}\` \n**Example**\`\`\`${cmd.example || "None"}\`\`\``,
                        color: c,
                    }
                    }
                );
            } else if(x.toLowerCase() === ("modules" || "module")){
                if(!args[1]) {
                    message.channel.createMessage(
                        {
                        embed: {
                                author: {
                                    name: bitch.user.username + " Help > Modules",
                                    icon_url: bitch.user.avatarURL
                                },
                                fields: [
                                    {
                                        name: "Moderation",
                                        value: "`help modules moderation`",
                                        inline: true
                                    },
                                    {
                                        name: "Utility",
                                        value: "`help modules utility`",
                                        inline: true
                                    },
                                    {
                                        name: "Settings",
                                        value: "`help modules settings`",
                                        inline: true
                                    },
                                ],
                                color: c,
                            }
                        }
                    );
                } else if(args[1].toLowerCase() === "moderation"){
                    let category = bitch.commands.filter(e => e.category === "moderation");
                    let cmds = category.map(e => `\`${e.name}\``).join(", ")
                    if(cmds < 1){
                        cmds = "None"
                    }
                    message.channel.createMessage(
                        {
                        embed: {
                                author: {
                                    name: bitch.user.username + " Help > Modules > Moderation",
                                    icon_url: bitch.user.avatarURL
                                },
                                description: cmds,
                                color: c,
                            }
                        }
                    );
                } else if(args[1].toLowerCase() === "settings"){
                    let category = bitch.commands.filter(e => e.category === "settings");
                    let cmds = category.map(e => `\`${e.name}\``).join(", ")
                    if(cmds < 1){
                        cmds = "`none`"
                    }

                    let category2 = bitch.commands.filter(e => e.category === "other");
                    let cmds2 = category2.map(e => `\`${e.name}\``).join(", ")
                    if(cmds < 1){
                        cmds2 = "`none`"
                    }

                    message.channel.createMessage(
                        {
                        embed: {
                                author: {
                                    name: bitch.user.username + " Help > Modules > Settings",
                                    icon_url: bitch.user.avatarURL
                                },
                                description: cmds + ", " + cmds2,
                                color: c,
                            }
                        }
                    );
                }  else if(args[1].toLowerCase() === "utility"){
                    let category = bitch.commands.filter(e => e.category === "utility");
                    let cmds = category.map(e => `\`${e.name}\``).join(", ")
                    if(cmds < 1){
                        cmds = "`none`"
                    }

                    message.channel.createMessage(
                        {
                        embed: {
                                author: {
                                    name: bitch.user.username + " Help > Modules > Utility",
                                    icon_url: bitch.user.avatarURL
                                },
                                description: cmds,
                                color: c,
                            }
                        }
                    );
                } else {
                    message.channel.createMessage(
                        {
                        embed: {
                                author: {
                                    name: "Unknown Module",
                                    icon_url: bitch.user.avatarURL
                                },
                                description: "Oops, this module doesn't exist.",
                                color: c,
                            }
                        }
                    );
                }
            } else {
                message.channel.createMessage(
                    {
                    embed: {
                        author: {
                            name: bitch.user.username + " Help",
                            icon_url: bitch.user.avatarURL
                        },
                        description: `Hello <@!${message.author.id}>, welcome to the help menu, Here you can find all the help you need.`,
                        color: c,
                        fields: [
                            {
                                name: "Help Commands",
                                value: "`help` \n`help modules` \n`help <commandName>`",
                                inline: true
                            },
                            {
                              name: "Support",
                              value: "https://discord.gg/ptJXWU7",
                              inline: true
                            },
                            {
                                name: "More",
                                value: "**[Dashboard](https://aqskqeak.glitch.me/)** \n[Invite](https://discord.com/oauth2/authorize?scope=bot&response_type=code&redirect_uri=http%3A%2F%2Faqskqeak.glitch.me%2F&permissions=943189247&client_id=732305355819843615)",
                                inline: true
                            },
                        ]
                    }
                    }
                );
            }
    }
};