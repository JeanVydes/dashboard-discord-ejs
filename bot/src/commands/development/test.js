const { format, findUser, findGuild, random, color, unique, resolve, resolveC } = require("../../utils/misc");

let commandName = "test";

module.exports = {
    name: commandName,
    category: null,
    description: null,
    usage: null,
    example: null,
    aliases: ["testing"],
    run: async function run(bitch, message,args) {
        if(message.author.id !== c.owner[0]) return;
        /*function resolve(argument){
            const idMatcher = /^([0-9]{15,21})$/;
            const userMentionMatcher = /<@!?([0-9]{15,21})>/;
    
            const idMatch = idMatcher.exec(argument) || userMentionMatcher.exec(argument)
            let member = null
    
            if (idMatch) {
                member = message.channel.guild.members.get(idMatch[1])
            } else {
                if (argument.length > 5 && argument.slice(-5, -4) === '#') {
                member = message.guild.members.find(e => `${e.username}#${e.discriminator}` === argument)
                } else if(argument.startsWith("#") && argument.charAt(0) && argument.length < 6) {
                member = message.guild.members.find(e => `#${e.discriminator}` === argument)
                } else if(argument.length < 5 && ! isNaN(argument)) {
                member = message.guild.members.find(e => `${e.discriminator}` === argument)
                } else {
                member = message.guild.members.find(member => member.username === argument)
                }
            }
    
            return member;
        }

        //let i = await color(message.guildID);
        //let member = await resolve(args[0])
        //let guild = await findGuild(message.guildID);
        //let user = await findUser(member.id)

        function resolveChannel(argument){
            const idMatcher = /^([0-9]{15,21})$/;
            const channelMentionMatcher = /<#?([0-9]{15,21})>/;

            const idMatch = idMatcher.exec(argument) || channelMentionMatcher.exec(argument)
            let channel = null
    
            if (idMatch) {
                channel = message.guild.channels.get(idMatch[1])
            } else {
                channel = message.guild.channels.find(channel => channel.name === argument.toLowerCase())
            }
    
            return channel;
        }

        //let i = await resolveChannel(args[0])*/

        /*const fetch = require("node-fetch");

        let { body } = await fetch("http://localhost:3000/api/welcome?message=test&background=https://cdn.discordapp.com/avatars/525842461655040011/5d298dd414d27e122174f1b6caed1b57.png&avatar=https://tecnovortex.com/wp-content/uploads/2019/04/wallpaper-engine.jpg&username=test")
        console.log(body)
        const attachment = new Eris.AttachmentMedia(body, 'welcome-image.png');*/

        let emojis = /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/g
        let regex = new RegExp(emojis);
        if(message.content.match(regex)){
            message.channel.createMessage("HAVE EMOJIS")
        }
        if(message.content.includes("<:emoji:736381873491804181>")){
            message.channel.createMessage("CUSTOM EMOJI")
        }
        message.channel.createMessage("Relax");
    }
}
