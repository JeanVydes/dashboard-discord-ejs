const { color, updateG } = require("../../utils/misc");

let commandName = "ping";

module.exports = {
    name: commandName,
    category: null,
    description: null,
    usage: null,
    example: null,
    aliases: [],
    run: async function run(bitch, message, args) {
      let c = await color(message.guild.id);
        return message.channel.createMessage(
          {
            embed: {
              description: "Pong!.",
              color: c
            }
          }
        );
    }
};