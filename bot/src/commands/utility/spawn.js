const { color, getGuild, support } = require("../../utils/misc");

let commandName = "spawn";

module.exports = {
  name: commandName,
  category: "utility",
  description: "Send your custom embeds.",
  usage: "send <embedName> [delete - displayMyName - mentionEveryone]",
  example: "spawm Embed1 \n",
  aliases: ["send", "execute", "embed"],
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

    if (!(message.member.permission.has("manageMessages"))) {
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

    let embedsAvailable;
    if(guild.embeds.length > 0){
      embedsAvailable = `\`\`\`\n${guild.embeds.map(i => `${i.name}`).join("\n")}\n\`\`\``
      if(embedsAvailable.length > 2000){
        embedsAvailable = "Many Embeds To Show"
      }
    } else {
      embedsAvailable = ""
    }

    if(!args[0]){
      return message.channel.createMessage(
        {
          embed: {
            author: {
              name: "Provide Name",
              icon_url: message.guild.iconURL
            },
            description: `${embedsAvailable} \nYou need provide a embed name or create new embed [here](https://aqskqeak.glitch.me/guild/${message.guild.id}/utility/constructor).`,
            color: c
          }
        }
      )
    }

    let emb = guild.embeds.find(e => e.name.toLowerCase().startsWith(args[0].toLowerCase()));
    if(!emb){
      return message.channel.createMessage(
        {
          embed: {
            author: {
              name: "Unknown Embed",
              icon_url: message.guild.iconURL
            },
            description: `Embed not found. Create new embed [here](https://aqskqeak.glitch.me/guild/${message.guild.id}/utility/constructor).`,
            color: c
          }
        }
      )
    }

    let matchThis = /(https?:\/\/.*\.(?:png|jpg|jpeg|gif|png|svg|webp))/g;
    let withThis = new RegExp(matchThis); 

    let myEmbed = { embed: {}};
    let myFields = [];
    let myFooter = {};
    let myAuthor = {};
    let myThumbnail = {};
    let myImage = {};

    if(emb.title){
      if(emb.title.length < 1) return;
      myEmbed.embed.title = emb.title;
    }

    if(emb.description){
      if(emb.description.length < 1) return;
      let fixedDescription = emb.description.replace(/\\n/g, "\n");
      myEmbed.embed.description = fixedDescription;
    }

    for(const x of emb.fields) {
      let newField = { inline: true };
      if(!x.name) x.name = "";
      if(!x.value) x.value = "";
      if(x.name.length > 0 && x.name.length < 256) {
        newField.name = x.name;
      } else {
          newField.name = "** **";
      }
      if(x.value.length > 0 && x.value.length < 256) {
        newField.value = x.value;
      } else {
        newField.value = "** **";
      }
      myFields.push(newField)
    }

    if(emb.footer){
      if(emb.footer.text){
        if(emb.footer.text.length < 1) return;
        myFooter.text = emb.footer.text;
      }

      if(emb.footer.url){
        if(!emb.footer.text){
          myFooter.text = "|";
        }
        if(emb.footer.length < 1) return;
        myFooter.icon_url = emb.footer.url;
      }
    }
    if(emb.author){
      if(emb.author.name){
        if(emb.author.name.length < 1) return;
        myAuthor.name = emb.author.name;
      }

      if(emb.author.url){
        if(emb.author.url.length < 1) return;
        myAuthor.url = emb.author.url;
      }

      if(emb.author.icon_url){
        if(emb.author.icon_url.length < 1) return;
        if(!emb.author.icon_url.match(withThis)) return;
        if(!emb.author.name){
          myAuthor.name = "|";
        }
        myAuthor.icon_url = emb.author.icon_url;
      }
    }

    if(emb.thumbnail){
      if(emb.thumbnail.url){
        if(emb.thumbnail.url.length < 1) return;
        if(!emb.thumbnail.url.match(withThis)) return;
        myThumbnail.url = emb.thumbnail.url;
      }
    }

    if(emb.image){
      if(emb.image.url){
        if(emb.image.url.length < 1) return;
        if(!emb.image.url.match(withThis)) return;
        myImage.url = emb.image.url;
      }
    }
    
    myEmbed.embed.footer = myFooter;
    myEmbed.embed.fields = myFields;
    myEmbed.embed.author = myAuthor;
    myEmbed.embed.thumbnail = myThumbnail;
    myEmbed.embed.image = myImage;
    myEmbed.embed.color = c;

    if(args[1]){
      if(args[1].toLowerCase() === "delete"){
        message.delete({ timeout: 100 });
      } else if(args[1].toLowerCase() === "displaymyname"){
        myEmbed.content = `By <@!${message.author.id}>`
      }  else if(args[1].toLowerCase() === "mentioneveryone"){
        myEmbed.content = "@everyone"
      } else {
        return message.channel.createMessage({
          embed: {
              author: {
                name: "Invalid Argument",
                icon_url: message.guild.iconURL
              },
              description: `Did you say \`delete\`, \`displayMyName\` \`mentionEveryone\`?`,
              color: c
            }
          }
        )
      }
    }

    try {
      message.channel.createMessage(myEmbed)
    } catch {
      message.channel.createMessage(
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