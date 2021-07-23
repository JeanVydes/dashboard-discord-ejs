const Eris = require("eris");
const Base = require("eris-sharder").Base;
const fs = require("fs");

const express = require("express");
const app = express();
const port = 5000;

const guildx = require("./mongo/models/guild");
const userx = require("./mongo/models/user");

const fetch = require("node-fetch");

const { unique, regexToMatchEmojis } = require("./utils/misc");

class bitch extends Base {
    constructor(bot) {
        super(bot);
    }

    launch() {
        this.bot.commands = new Eris.Collection();
        this.bot.aliases = new Eris.Collection();

        require(`./handlers/command`)(this.bot);

        this.bot.on("messageCreate", async message => {

            if (message.author.bot) return;
            if (message.channel.type === "dm") return;

            let user;
            let userPrefix;
            try {
              user = await userx.findOne({ id: message.author.id });
              userPrefix = user.settings.prefixes
            } catch {
              let newUser = new userx({
                id: message.author.id
              });
              await newUser.save();
              userPrefix = [];
            }

            let guild = await guildx.findOne({ id: message.guild.id });
            let guildPrefix = guild.settings.prefixes;

            let prefixes = unique(userPrefix.concat(guildPrefix));
            let prefix = false;
            for(const ofPrefix of prefixes) {
                if(message.content.startsWith(ofPrefix)) prefix = ofPrefix;
            }
            const args = message.content.slice(prefix.length).trim().split(/ +/);
            const command = args.shift().toLowerCase();
            let cmd = this.bot.commands.get(command) || this.bot.commands.find(cmd => cmd.aliases && cmd.aliases.includes(command));

            if(prefix && cmd) {
                return cmd.run(this.bot, message, args);
            } else {
                let guildMe = message.guild.members.find(e => e.id === this.bot.user.id);

                if (!guildMe.permission.has("manageMessages")) return;
                if (guild.settings.modules.moderation === false) return;
                if (guild.settings.ignored.includes(message.channel.id)) return;
                if (guild.automoderator.ignored.includes(message.channel.id)) return;
                if (guild.automoderator.ignored_roles.some(e => message.member.roles.includes(e))) return;


                if (guild.automoderator.bad.status) {
                        if (guild.automoderator.bad.words.some(word => message.content.toLowerCase().includes(word))) {
                            message.delete({ timeout: 250, reason: "Auto Moderator: Bad Words." });
                            message.channel.createMessage({
                                embed: {
                                    title: "Auto Moderator",
                                    fields: [
                                        {
                                            name: "Type",
                                            value: "Bad Word",
                                            inline: true
                                        },
                                        {
                                            name: "Member",
                                            value: `<@!${message.author.id}>`,
                                            inline: true
                                        }
                                    ],
                                    color: 0x2f3136
                                }
                            });
                        }
                }
                if (guild.automoderator.invites.status) {
                        let matchThis = /(https?:\/\/)?(www\.)?(discord\.(gg|io|me|li)|discordapp\.com\/invite)\/.+[a-z]/g;
                        let withThis = new RegExp(matchThis);
                        if (message.content.match(withThis)) {
                            message.delete({ timeout: 250, reason: "Auto Moderator: Anti Links." });
                            message.channel.createMessage({
                                embed: {
                                    title: "Auto Moderator",
                                    fields: [
                                        {
                                            name: "Type",
                                            value: "Invite",
                                            inline: true
                                        },
                                        {
                                            name: "Member",
                                            value: `<@!${message.author.id}>`,
                                            inline: true
                                        }
                                    ],
                                    color: 0x2f3136
                                }
                            });
                        }
                }
                if (guild.automoderator.links.status) {
                        let matchThis = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;
                        let withThis = new RegExp(matchThis);
                        if (message.content.match(withThis)) {
                            message.delete({ timeout: 250, reason: "Auto Moderator: Anti Links." });
                            message.channel.createMessage({
                                embed: {
                                    title: "Auto Moderator",
                                    fields: [
                                        {
                                            name: "Type",
                                            value: "Link",
                                            inline: true
                                        },
                                        {
                                            name: "Member",
                                            value: `<@!${message.author.id}>`,
                                            inline: true
                                        }
                                    ],
                                    color: 0x2f3136
                                }
                            });
                        }
                }
                if (guild.automoderator.mentions.status) {
                        const count = (str) => {
                            const re = /<@!?([0-9]{15,21})>/g
                            return ((str || '').match(re) || []).length
                        }

                        if (count(message.content) > guild.automoderator.mentions.range - 1) {
                            message.delete({ timeout: 250, reason: "Auto Moderator: Mass Mention." });
                            message.channel.createMessage({
                                embed: {
                                    title: "Auto Moderator",
                                    fields: [
                                        {
                                            name: "Type",
                                            value: "Mass Mention",
                                            inline: true
                                        },
                                        {
                                            name: "Member",
                                            value: `<@!${message.author.id}>`,
                                            inline: true
                                        }
                                    ],
                                    color: 0x2f3136
                                }
                            });
                        }
                }
                if (guild.automoderator.emojis.status) {
                    const count = (str) => {
                        const re = regexToMatchEmojis
                        return ((str || '').match(re) || []).length
                    }
                    
                    if(count(message.content) > guild.automoderator.emojis.range){
                            message.delete({ timeout: 250, reason: "Auto Moderator: Anti Mass Emojis." });
                            message.channel.createMessage({
                                embed: {
                                    title: "Auto Moderator",
                                    fields: [
                                        {
                                            name: "Type",
                                            value: "Mass Emojis",
                                            inline: true
                                        },
                                        {
                                            name: "Member",
                                            value: `<@!${message.author.id}>`,
                                            inline: true
                                        }
                                    ],
                                    color: 0x2f3136
                                }
                            });
                    }
                }
                if (guild.automoderator.images.status) {
                        if (message.attachments[0]) {
                            message.delete({ timeout: 250, reason: "Auto Moderator: Images." });
                            message.channel.createMessage({
                                embed: {
                                    title: "Auto Moderator",
                                    fields: [
                                        {
                                            name: "Type",
                                            value: "Images",
                                            inline: true
                                        },
                                        {
                                            name: "Member",
                                            value: `<@!${message.author.id}>`,
                                            inline: true
                                        }
                                    ],
                                    color: 0x2f3136
                                }
                            });
                        }

                        let imageURL = /(https?:\/\/.*\.(?:png|jpg|jpeg|gif|png|svg))/g;
                        let imageRegex = new RegExp(imageURL);
                        if (message.content.match(imageRegex)) {
                            message.delete({ timeout: 250, reason: "Auto Moderator: Images." });
                            message.channel.createMessage({
                                embed: {
                                    title: "Auto Moderator",
                                    fields: [
                                        {
                                            name: "Type",
                                            value: "Images",
                                            inline: true
                                        },
                                        {
                                            name: "Member",
                                            value: `<@!${message.author.id}>`,
                                            inline: true
                                        }
                                    ],
                                    color: 0x2f3136
                                }
                            });
                        }
                }
                if (guild.automoderator.caps.status) {

                }
            }
        });

        this.bot.on("guildMemberAdd", async (guild, member) => {
            
            if (!guild) return;
            if (member.id === this.bot.user.id) return;

            let thisGuild = await guildx.findOne({ id: guild.id });

            if(thisGuild.settings.modules.utility === true){
              if(thisGuild.settings.private_guild === true) {
                  member.kick({ reason: "Private Guild"});
              }

              if(!guild.members.find(e => e.id === this.bot.user.id).permission.has("manageRoles")) return;
              if(!member.bot){
                if(thisGuild.settings.autorole.members.status === true){
                  if(thisGuild.settings.autorole.members.role){
                    let roleToAdd = guild.roles.find(e => e.id === thisGuild.settings.autorole.members.role);
                    if(!roleToAdd) return;
                    member.addRole(roleToAdd.id)
                  }
                }
              }
              if(member.bot){
                if(thisGuild.settings.autorole.bots.status === true){
                  if(thisGuild.settings.autorole.bots.role){
                    let roleToAdd = guild.roles.find(e => e.id === thisGuild.settings.autorole.bots.role);
                    if(!roleToAdd) return;
                    member.addRole(roleToAdd.id)
                  }
                }
              }
            }
        });

        this.bot.on("guildCreate", async (guild) => {
            guildx.findOne({ id: guild.id }, async (err, guildI) => {
                if (!guildI) {
                    const newGuild = new guildx({
                        id: guild.id,
                        name: guild.name
                    });
                    await newGuild.save();
                }
            })
        });

        this.bot.on("guildDelete", async (guild) => {
            await guildx.findOneAndDelete({ id: guild.id });
        });

        app.get("/", (req, res) => {
           res.status(200).json({
                status: 200,
                public: true,
                data: {
                    id: this.bot.user.id,
                    shards: this.bot.shards.size,
                    options: {
                        mentions: this.bot.options.allowedMentions
                    }
                }
            })
        })
        
        app.get("/api/v1/client/status", (req, res) => {
            res.status(200).json({
                status: 200,
                public: true,
                data: {
                    id: this.bot.user.id,
                    shards: this.bot.shards.size,
                    options: {
                        mentions: this.bot.options.allowedMentions
                    }
                }
            })
        });

        app.get("/api/v1/client/shards", (req, res) => {
            res.status(200).json({
                status: 200,
                public: true,
                data: {
                    id: this.bot.user.id,
                    shards: this.bot.shards.size,
                    options: {
                        mentions: this.bot.options.allowedMentions
                    }
                }
            })
        });

        app.listen(port, () => { });

        this.bot.editStatus("online", { name: null, game: null });
        /*this.bot.executeWebhook("736383085112852523", "wrOCnfuyfTWImYL7r4INGIgHdewN8mBwQFWNBc6_ZPt-C0bSxnU_sXgq52ZyzvsMrGkW", { content: `<:online:736381873688674355> <@!732305355819843615> is currently operational with **${this.bot.shards.size}** shards. It may take longer to start in all guilds.` });*/
    }
}

module.exports = bitch;