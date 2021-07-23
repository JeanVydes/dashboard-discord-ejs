const { color, getGuild, support } = require("../../utils/misc");
let newGuild = require("../../mongo/models/guild"); 

let commandName = "tag";

module.exports = {
  name: commandName,
  category: "utility",
  description: "Create custom tags for your guild.",
  usage: "send [add - delete - tagName] [tagName] [tagDescription]",
  example: "tag add newNote this is a note. \ntag newNote \ntag delete newNote",
  aliases: ["tags"],
  run: async function run(bitch, message, args) {

    let guild = await getGuild(message.guild.id);
    let c = await color(message.guild.id);

    if (!guild.settings.modules.utility) {
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


    let tags;
    if(guild.tags.length > 0){
      tags = `\`\`\`\n${guild.tags.map(e => `${e.name}`).join(", ")}\n\`\`\``
    } else {
      tags = ""
    }
    
    if(!args[0]){
      return message.channel.createMessage(
        {
          embed: {
            author: {
              name: "Arguments",
              icon_url: message.guild.iconURL
            },
            description: `You need to specify a tag name, or if you want to create another one you have: \`!tag add <tagName> <tagDescription>\` or delete one \`!tag delete <tagName>\`. \n${tags}`,
            color: c
          }
        }
      )
    }

    if(args[0].toLowerCase() === "add"){
          if (!(message.member.permission.has("manageMessages") || message.author.id === "525842461655040011")) {
      return message.channel.createMessage(
        {
          embed: {
            author: {
              name: "Permissions",
              icon_url: message.guild.iconURL
            },
            description: "You not have `Manage Messages` permissions.",
            color: c
          }
        }
      )
    }
      if(!args[1]){
        return message.channel.createMessage(
          {
            embed: {
              author: {
                name: "Name?",
                icon_url: message.guild.iconURL
              },
              description: "You need to specify a new tag name `!tag add <tagName> <tagDescription>`.",
              color: c
            }
          }
        )
      }

      if(args[1].toLowerCase() === ("add" || "delete")){
        return message.channel.createMessage(
          {
            embed: {
              author: {
                name: "Unavailable",
                icon_url: message.guild.iconURL
              },
              description: "This name tag is not available `!tag add <tagName> <tagDescription>`.",
              color: c
            }
          }
        )
      }

      let description = args.splice(2).join(" ");
      if(!description){
        return message.channel.createMessage(
          {
            embed: {
              author: {
                name: "Description?",
                icon_url: message.guild.iconURL
              },
              description: "You need to specify a new tag description `!tag add <tagName> <tagDescription>`.",
              color: c
            }
          }
        )
      }

      let existTag = guild.tags.find(e => e.name.toLowerCase() === args[1].toLowerCase());
      if(existTag){
        return message.channel.createMessage(
          {
            embed: {
              author: {
                name: "Exist",
                icon_url: message.guild.iconURL
              },
              description: "This tag already exists.",
              color: c
            }
          }
        )
      }

      try {
        await newGuild.findOneAndUpdate({ id: message.guild.id }, { $push: { tags: { name: args[1].toLowerCase(), description: description }}})
      } catch {
        return message.channel.createMessage(
          {
            embed: {
              author: {
                name: "ERROR!",
                icon_url: message.guild.iconURL
              },
              description: `Please contact our support team [this](${support}).`,
              color: c
            }
          }
        )
      }

      let fixedDescription = description.replace(/\\n/g, "\n");
      return message.channel.createMessage(
        {
            embed: {
              author: {
                name: "New Tag!",
                icon_url: message.guild.iconURL
              },
              description: `**Name**: ${args[1]} \n**Description**: ${fixedDescription}`,
              color: c
            }
        }
      );
    }
    if(args[0].toLowerCase() === "delete"){
          if (!(message.member.permission.has("manageMessages") || message.author.id === "525842461655040011")) {
      return message.channel.createMessage(
        {
          embed: {
            author: {
              name: "Permissions",
              icon_url: message.guild.iconURL
            },
            description: "You not have `Manage Messages` permissions.",
            color: c
          }
        }
      )
    }
      if(!args[1]){
        return message.channel.createMessage(
          {
            embed: {
              author: {
                name: "Name?",
                icon_url: message.guild.iconURL
              },
              description: "You need to specify a tag name. `!tag delete <tagName>`",
              color: c
            }
          }
        )
      }

      if(args[1].toLowerCase() === ("add" || "delete")){
        return message.channel.createMessage(
          {
            embed: {
              author: {
                name: "Unavailable",
                icon_url: message.guild.iconURL
              },
              description: "This name tag never is available.",
              color: c
            }
          }
        )
      }

      let existTag = guild.tags.find(e => e.name.toLowerCase() === args[1].toLowerCase());
      if(!existTag){
        return message.channel.createMessage(
          {
            embed: {
              author: {
                name: "Doenst Exist",
                icon_url: message.guild.iconURL
              },
              description: "This tag doesn't exists.",
              color: c
            }
          }
        )
      }

      try {
        await newGuild.findOneAndUpdate({ id: message.guild.id }, { $pull: { tags: { name: args[1].toLowerCase() }}})
      } catch {
        return message.channel.createMessage(
          {
            embed: {
              author: {
                name: "ERROR!",
                icon_url: message.guild.iconURL
              },
              description: `Please contact our support team [this](${support}).`,
              color: c
            }
          }
        )
      }

      return message.channel.createMessage({
        embed: {
          author: {
              name: "Deleted",
              icon_url: message.guild.iconURL
            },
            description: "This tag has been deleted.",
            color: c
        }
      })
    }

    let thisTag = guild.tags.find(e => e.name.toLowerCase() === args[0].toLowerCase());
    if(!thisTag){
      return message.channel.createMessage(
        {
          embed: {
            author: {
              name: "Doenst Exist",
                icon_url: message.guild.iconURL
            },
            description: "This tag doesn't exist.",
            color: c
          }
        }
      )
    }

    if(args[1]){
      if(args[1].toLowerCase() === "delete"){
        message.delete({ timeout: 100 });
      }
    }

    let fixedDescription = thisTag.description.replace(/\\n/g, "\n");
    try {
      message.channel.createMessage({
        embed: {
          description: fixedDescription,
          color: c
        }
      })
    } catch {
      return message.channel.createMessage(
        {
          embed: {
            author: {
              name: "ERROR!",
              icon_url: message.guild.iconURL
            },
            description: `Please contact our support team [this](${support}).`,
            color: c
          }
        }
      )
    }
  }
}