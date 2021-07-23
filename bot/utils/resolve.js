let memberResolve = {
    func: (message, argument) => {
        const idMatcher = /^([0-9]{15,21})$/;
        const userMentionMatcher = /<@!?([0-9]{15,21})>/;

        const idMatch = idMatcher.exec(argument) || userMentionMatcher.exec(argument)
        let member = null

        if (idMatch) {
            member = message.channel.guild.members.get(idMatch[1])
        } else {
            if (argument.length > 5 && argument.slice(-5, -4) === '#') {
                member = message.guild.members.find(e => `${e.username}#${e.discriminator}` === argument)
            } else if(argument.length < 5 && !isNaN(argument)) {
                member = message.guild.members.find(e => `${e.discriminator}` === argument)
            } else {
                member = message.guild.members.find(e => e.username.toLowerCase().startsWith(argument.toLowerCase()))
            }
        }

        return member;
    }
}

let channelResolve = {
    func: (message, argument) => {
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
}

let getID = {
    func: (argument) => {
        const idMatcher = /^([0-9]{15,21})$/;
        const userMentionMatcher = /<@!?([0-9]{15,21})>/;

        const idMatch = idMatcher.exec(argument) || userMentionMatcher.exec(argument)
        let member = idMatch;

        return member;
    }
}

module.exports = { memberResolve, channelResolve, getID }