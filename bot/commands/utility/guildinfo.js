const { color, resolve, getGuild, today, emojis } = require("../../utils/misc");

let commandName = "guildinfo";

module.exports = {
  name: commandName,
  category: null,
  description: "Get utility info about this guild.",
  usage: "guildinfo",
  example: "guildinfo",
  aliases: ["serverinfo"],
  run: async function run(bitch, message, args) {

    let guild = await getGuild(message.guild.id);
    let c = await color(message.guild.id);
    let status = {
      online: "<:online:736381873491804181> Online",
      idle: "<:idle:736391076755144824> AFK",
      dnd: "<:dnd:736381873491804181> Do not Disturb",
      streaming: "<:streaming:736381873328226365> Streaming",
      offline: "<:offline:736381873470701608> Offline"
    }

    let regions = {
        "eu-central": ":flag_eu: Central Europe",
        "singapore": ":flag_sg: Singapore",
        "us-central": ":flag_us: U.S. Central",
        "sydney": ":flag_au: Sydney",
        "us-east": ":flag_us: U.S. East",
        "us-south": ":flag_us: U.S. South",
        "us-west": ":flag_us: U.S. West",
        "eu-west": ":flag_eu: Western Europe",
        "vip-us-east": ":flag_us: VIP U.S. East",
        "london": ":flag_gb: London",
        "amsterdam": ":flag_nl: Amsterdam",
        "hongkong": ":flag_hk: Hong Kong",
        "russia": ":flag_ru: Russia",
        "southafrica": ":flag_za:  South Africa"
    };

    let verifiedLevel = {
      0: "**None** [Unrestricted]",
      1: "**Low** [Must have a verified email on their Discord account.]",
      2: "**Medium** [Must also be registered on Discord for longer than 5 minutes.]",
      3: "**Hight** [Must also be a member of this server for longer than 10 minutes.]",
      5: "**Very Hight** [Must have a verified phone on their Discord account.]"
    };
    
    let explicitContentLevel = {
      0: `Disabled`,
      1: `Scan Only Members Without Roles`,
      2: `Scan All Members`
    }
    
    let mfaLevel = {
      0: `Disabled`,
      1: `Elevated`,
    }
    
    let premiumTierLevel = {
      0: `Level 0`,
      1: `Level 1`,
      2: `Level 2`,
      3: `Level 3`
    }

    let features = {
      "INVITE_SPLASH": "Invite Splash",
      "WELCOME_SCREEN_ENABLED": "Welcome Screen",
      "PUBLIC_DISABLED": "Disable Public",
      "BANNER": "Banner",
      "ANIMATED_ICON": "Animated Icon",
      "FEATURABLE": "Featurable",
      "DISCOVERABLE": "Discoverable",
      "NEWS": "News",
      "COMMERCE": "Commerce",
      "PUBLIC": "Public",
      "PARTNERED": "Partnered",
      "VERIFIED": "Verified",
      "VANITY_URL": "Vanity Url",
      "VIP_REGIONS": "Vip Regions",
      "COMMUNITY": "Community"
    }

    return message.channel.createMessage({
      embed: {
        author: {
          name: message.guild.name,
          icon_url: message.guild.iconURL
        },
        fields: [
          {
            name: "ID",
            value: message.guild.id,
            inline: true
          },
          {
            name: "Name",
            value:  message.guild.name,
            inline: true
          },
          {
            name: "Owner",
            value: `<@!${message.guild.ownerID}> ${emojis.owner_guild}`,
            inline: true
          },
          {
            name: "Verification",
            value: verifiedLevel[message.guild.verificationLevel],
            inline: false
          },
          {
            name: "Explicit Content Filter",
            value: explicitContentLevel[message.guild.explicitContentFilter],
            inline: true
          },
          {
            name: "MFA Level",
            value: mfaLevel[message.guild.mfaLevel],
            inline: true
          },
          {
            name: "Nitro Tier",
            value: premiumTierLevel[message.guild.premiumTier]
          },
          {
            name: "Nitro Boosters",
            value: message.guild.premiumSubscriptionCount,
            inline: true
          },
          {
            name: "Features",
            value: message.guild.features.map(x => `${features[x]}`).join(", "),
            inline: false
          },
        ],
        color: c
      }
    })
  }
}