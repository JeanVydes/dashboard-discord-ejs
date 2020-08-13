const router = require("express").Router();
let guild = require("../../backend/mongo/models/guild/guild");

function remove_duplicates(arr) {
    var obj = {};
    var ret_arr = [];
    for (var i = 0; i < arr.length; i++) {
        obj[arr[i]] = true;
    }
    for (var key in obj) {
        ret_arr.push(key);
    }
    return ret_arr;
}

router.get("/:id", async function(req, res) {

    let gui = req.client.guilds.get(req.params.id);
    let guildi = await guild.findOne({ id: gui.id });
    let inGuild = req.client.guilds.cache.get(req.params.id).members.find(e => e.id === req.user.id);
    let hasPermission = inGuild.permission.has("MANAGE_GUILD");
  
    if(!(req.params.id || inGuild || guildi || gui || hasPermission)){
        return res.redirect("/dashboard");
    }
    
    let y = guildi.settings.ignored;
    let x = req.client.guilds.get(gui.id).channels.filter(e => e.type === 0);
    let a = [];
    x.forEach(e => {
        if(!y.includes(e.id)){
            a.push(e)
        }
    });

    let user_fetched;
    let new_user = (data) => { 
       user_fetched = data;
    };
    await req.client.getRESTUser(req.user.id).then((e) => new_user(e));

    res.render("guild", {
        id: (req.isAuthenticated() ? `${req.user.id}` : false),
        username: (req.isAuthenticated() ? `${user_fetched.username}` : false),
        avatar: (req.isAuthenticated() ? `https://cdn.discordapp.com/avatars/${req.user.id}/${user_fetched.avatar}.png?size=2048` : null),
        show: (req.isAuthenticated() ? true : false),

        bot: req.client,

        guild_id: gui.id,
        guild_name: gui.name,
        guild_icon: gui.icon,
        guild_prefixes: guildi.settings.prefixes,
    });
});


router.get("/:id/settings", async function(req, res) {

    let gui = req.client.guilds.get(req.params.id);
    let guildi = await guild.findOne({ id: gui.id });
    let inGuild = req.client.guilds.cache.get(req.params.id).members.find(e => e.id === req.user.id);
    let hasPermission = inGuild.permission.has("MANAGE_GUILD");
  
    if(!(req.params.id || inGuild || guildi || gui || hasPermission)){
        return res.redirect("/dashboard");
    }
    
    let y = guildi.settings.ignored;
    let x = req.client.guilds.get(gui.id).channels.filter(e => e.type === 0);
    let a = [];
    for (const value of x) {
        if(!y.includes(value.id)){
            a.push(value)
        }
    }

    let user_fetched;
    let new_user = (data) => { 
       user_fetched = data;
    };
    await req.client.getRESTUser(req.user.id).then((e) => new_user(e));

    let thisColor = guildi.settings.color.toString(16);

    res.render("settings", {
        id: (req.isAuthenticated() ? `${req.user.id}` : false),
        avatar: (req.isAuthenticated() ? `https://cdn.discordapp.com/avatars/${req.user.id}/${user_fetched.avatar}.png?size=2048` : null),
        show: (req.isAuthenticated() ? true : false),

        bot: req.client,

        guild_id: gui.id,
        guild_name: gui.name,
        guild_icon: gui.icon,
        guild_prefixes: guildi.settings.prefixes,

        moderation: guildi.settings.modules.moderation,
        utility: guildi.settings.modules.utility,
        music: guildi.settings.modules.music,

        guild_channels: a,
        guild_channels_ignored: y,

        color: thisColor
    });
});


router.get("/:id/utility", async function(req, res) {

    let gui = req.client.guilds.get(req.params.id);
    let thisGuild = await guild.findOne({ id: gui.id });
    let inGuild = req.client.guilds.cache.get(req.params.id).members.find(e => e.id === req.user.id);
    let hasPermission = inGuild.permission.has("MANAGE_GUILD");
  
    if(!(req.params.id || inGuild || thisGuild || gui || hasPermission)){
        return res.redirect("/dashboard");
    }

    let user_fetched;
    let new_user = (data) => { 
       user_fetched = data;
    };
    await req.client.getRESTUser(req.user.id).then((e) => new_user(e));

    res.render("utility", {
        id: (req.isAuthenticated() ? `${req.user.id}` : false),
        avatar: (req.isAuthenticated() ? `https://cdn.discordapp.com/avatars/${req.user.id}/${user_fetched.avatar}.png?size=2048` : null),
        show: (req.isAuthenticated() ? true : false),

        bot: req.client,

        guild_id: gui.id,
        guild_name: gui.name,
        guild_icon: gui.icon,
      
        embeds: thisGuild.embeds,
      
        auto_role_members_status: thisGuild.settings.autorole.members.status,
        auto_role_members_role: thisGuild.settings.autorole.members.role,

        auto_role_bots_status: thisGuild.settings.autorole.bots.status,
        auto_role_bots_role: thisGuild.settings.autorole.bots.role,
      
        private_guild: thisGuild.settings.private_guild
    });
});

router.get("/:id/utility/constructor", async function(req, res) {

    let gui = req.client.guilds.get(req.params.id);
    let thisGuild = await guild.findOne({ id: gui.id });
    let inGuild = req.client.guilds.cache.get(req.params.id).members.find(e => e.id === req.user.id);
    let hasPermission = inGuild.permission.has("MANAGE_GUILD");
  
    if(!(req.params.id || inGuild || thisGuild || gui || hasPermission)){
        return res.redirect("/dashboard");
    }
  
    let user_fetched;
    let new_user = (data) => { 
       user_fetched = data;
    };
    await req.client.getRESTUser(req.user.id).then((e) => new_user(e));
  
    res.render("constructor", {
        id: (req.isAuthenticated() ? `${req.user.id}` : false),
        avatar: (req.isAuthenticated() ? `https://cdn.discordapp.com/avatars/${req.user.id}/${user_fetched.avatar}.png?size=2048` : null),
        show: (req.isAuthenticated() ? true : false),

        bot: req.client,

        guild_id: gui.id,
        guild_name: gui.name,
        guild_icon: gui.icon,
      
        embeds: thisGuild.embeds,
    });
});

router.get("/:id/utility/constructor/:name/edit", async function(req, res) {
    let gui = req.client.guilds.get(req.params.id);
    let thisGuild = await guild.findOne({ id: gui.id });
    let inGuild = req.client.guilds.cache.get(req.params.id).members.find(e => e.id === req.user.id);
    let hasPermission = inGuild.permission.has("MANAGE_GUILD");
	
    if(!(req.params.id || inGuild || thisGuild || gui || hasPermission)){
        return res.redirect("/dashboard");
    }
  
    let existEmbed = thisGuild.embeds.find(e => e.name.toLowerCase() === req.params.name.toLowerCase());
    if(!existEmbed) {
        return res.redirect(`/guild/${req.params.id}/utility}`);
    }

    let user_fetched;
    let new_user = (data) => { 
       user_fetched = data;
    };
    await req.client.getRESTUser(req.user.id).then((e) => new_user(e));
  
    res.render("constructor_edit", {
        id: (req.isAuthenticated() ? `${req.user.id}` : false),
        avatar: (req.isAuthenticated() ? `https://cdn.discordapp.com/avatars/${req.user.id}/${user_fetched.avatar}.png?size=2048` : null),
        show: (req.isAuthenticated() ? true : false),

        bot: req.client,

        guild_id: gui.id,
        guild_name: gui.name,
        guild_icon: gui.icon,
      
        embed: existEmbed,
        embeds: thisGuild.embeds
    });
});


router.get("/:id/moderation", async function(req, res) {
    let gui = req.client.guilds.get(req.params.id);
    let guildi = await guild.findOne({ id: gui.id });
    let inGuild = req.client.guilds.cache.get(req.params.id).members.find(e => e.id === req.user.id);
    let hasPermission = inGuild.permission.has("MANAGE_GUILD");
  
    if(!(req.params.id || inGuild || guildi || gui || hasPermission)){
        return res.redirect("/dashboard");
    }
    
    let auto_ignored = guildi.automoderator.ignored;

    let allChannels = req.client.guilds.get(gui.id).channels.filter(e => e.type === 0);
    let a = [];
    for (const value of allChannels) {
        if(!auto_ignored.includes(value.id)){
            a.push(value)
        }
    }

    let auto_ignored_roles = guildi.automoderator.ignored_roles;
    let allRoles = req.client.guilds.get(gui.id).roles.filter(e => e.managed === false && e.name !== "@everyone");
    let rolesNoIgnore = [];
    for (const value of allRoles) {
        if(!auto_ignored_roles.includes(value.id)){
            rolesNoIgnore.push(value)
        }
    }

    let user_fetched;
    let new_user = (data) => { 
       user_fetched = data;
    };
    await req.client.getRESTUser(req.user.id).then((e) => new_user(e));

    res.render("moderation", {
        id: (req.isAuthenticated() ? `${req.user.id}` : false),
        avatar: (req.isAuthenticated() ? `https://cdn.discordapp.com/avatars/${req.user.id}/${user_fetched.avatar}.png?size=2048` : null),
        show: (req.isAuthenticated() ? true : false),

        bot: req.client,

        guild_id: gui.id,
        guild_icon: gui.icon,
        guild_name: gui.name,

        guild_channels: a,
        guild_channels_ignored_moderator: auto_ignored,

        guild_roles: rolesNoIgnore,
        guild_roles_ignored_moderator: auto_ignored_roles,

        bad: guildi.automoderator.bad.status,
        links: guildi.automoderator.links.status,
        invites: guildi.automoderator.invites.status,
        mentions: guildi.automoderator.mentions.status,
        spam: guildi.automoderator.spam.status,
        emojis: guildi.automoderator.emojis.status,
        caps: guildi.automoderator.caps.status,
        images: guildi.automoderator.images.status,

        spamsen: guildi.automoderator.spam.sensibility,
        mentionsrange: guildi.automoderator.mentions.range,
        emojisrange: guildi.automoderator.emojis.range,

        bad_words: guildi.automoderator.bad.words,
    });
});


router.get("/:id/stats", async function(req, res) {
    let gui = req.client.guilds.get(req.params.id);
    let inGuild = req.client.guilds.cache.get(req.params.id).members.find(e => e.id === req.user.id);
    let hasPermission = inGuild.permission.has("MANAGE_GUILD");
  
    if(!(req.params.id || inGuild || gui || hasPermission)){
        return res.redirect("/dashboard");
    }

    let user_fetched;
    let new_user = (data) => { 
       user_fetched = data;
    };
    await req.client.getRESTUser(req.user.id).then((e) => new_user(e));

    res.render("stats", {
        id: (req.isAuthenticated() ? `${req.user.id}` : false),
        avatar: (req.isAuthenticated() ? `https://cdn.discordapp.com/avatars/${req.user.id}/${user_fetched.avatar}.png?size=2048` : null),
        show: (req.isAuthenticated() ? true : false),

        bot: req.client,

        guild_id: gui.id,
        guild_icon: gui.icon,
        guild_name: gui.name,

        
    });
});


router.post("/:id/prefix/update", async (req, res) => {
    let gui = req.client.guilds.get(req.params.id);
    let inGuild = req.client.guilds.cache.get(req.params.id).members.find(e => e.id === req.user.id);
    let hasPermission = inGuild.permission.has("MANAGE_GUILD");
  
    if(!(req.params.id || inGuild || gui || hasPermission)){
        return res.redirect("/dashboard");
    }

    let data = req.body;
    let id = req.params.id;
    
    let exist = await guild.findOne({ id: id });
    if(!exist){
        return res.redirect("/");
    }

    if(data.prefix){
       let test = await guild.findOne({ id: id });     
        let array = test.settings.prefixes;
        array.push(data.prefix)
        let fixed = remove_duplicates(array);
        await guild.findOneAndUpdate({ id: id }, { $set: { "settings.prefixes": fixed } }); 
    }

    await res.redirect(`/guild/${req.params.id}/settings`);
});

router.post("/:id/prefix/delete", async (req, res) => {
    let gui = req.client.guilds.get(req.params.id);
    let inGuild = req.client.guilds.cache.get(req.params.id).members.find(e => e.id === req.user.id);
    let hasPermission = inGuild.permission.has("MANAGE_GUILD");
  
    if(!(req.params.id || inGuild || gui || hasPermission)){
        return res.redirect("/dashboard");
    }

    let data = req.body;
    let id = req.params.id;

    let exist = await guild.findOne({ id: id });
    if(!exist){
        return res.redirect("/");
    }

    if(data.prefix){
        await guild.findOneAndUpdate({ id: id }, { $pull: { "settings.prefixes": data.prefix } });
    }

    await res.redirect(`/guild/${req.params.id}/settings`);
});

router.post("/:id/modules/update", async (req, res) => {
    let gui = req.client.guilds.get(req.params.id);
    let inGuild = req.client.guilds.cache.get(req.params.id).members.find(e => e.id === req.user.id);
    let hasPermission = inGuild.permission.has("MANAGE_GUILD");
  
    if(!(req.params.id || inGuild || gui || hasPermission)){
        return res.redirect("/dashboard");
    }

    let data = req.body;
    let moderation = data["moderation-module"] ? true : false;
    let utility = data["utility-module"] ? true : false;
    let music = data["music-module"] ? true : false;

    let id = req.params.id;

    let exist = await guild.findOne({ id: id });
    if(!exist){
        return res.redirect("/");
    }

    if(moderation){
        await guild.findOneAndUpdate({ id: id }, { $set: { "settings.modules.moderation": true } });
    } else if(!moderation){
        await guild.findOneAndUpdate({ id: id }, { $set: { "settings.modules.moderation": false } });
    }

    if(utility){
        await guild.findOneAndUpdate({ id: id }, { $set: { "settings.modules.utility": true } });
    } else if(!utility){
        await guild.findOneAndUpdate({ id: id }, { $set: { "settings.modules.utility": false } });
    }

    if(music){
        await guild.findOneAndUpdate({ id: id }, { $set: { "settings.modules.music": true } });
    } else if(!music){
        await guild.findOneAndUpdate({ id: id }, { $set: { "settings.modules.music": false } });
    }

    await res.redirect(`/guild/${req.params.id}/settings`);
});

router.post("/:id/ignored-channels/update", async (req, res) => {
    let gui = req.client.guilds.get(req.params.id);
    let inGuild = req.client.guilds.cache.get(req.params.id).members.find(e => e.id === req.user.id);
    let hasPermission = inGuild.permission.has("MANAGE_GUILD");
  
    if(!(req.params.id || inGuild || gui || hasPermission)){
        return res.redirect("/dashboard");
    }

    let data = req.body;
    let id = req.params.id;

    let exist = await guild.findOne({ id: id });
    if(!exist){
        return res.redirect("/");
    }

    if(typeof data.channels === "string"){
        let array = exist.settings.ignored;
        array.push(data.channels)
        let fixed = remove_duplicates(array);
        await guild.findOneAndUpdate({ id: id }, { $set: { "settings.ignored": fixed } });
    } else {
        for (const value of data.channels) {
          let array = exist.settings.ignored;
          array.push(value)
          let fixed = remove_duplicates(array);
            await guild.findOneAndUpdate({ id: id }, { $set: { "settings.ignored": fixed } });
        }
    }

    await res.redirect(`/guild/${req.params.id}/settings`);
});

router.post("/:id/ignored-channel/delete", async (req, res) => {
    let gui = req.client.guilds.get(req.params.id);
    let inGuild = req.client.guilds.cache.get(req.params.id).members.find(e => e.id === req.user.id);
    let hasPermission = inGuild.permission.has("MANAGE_GUILD");
	
    if(!(req.params.id || inGuild || gui || hasPermission)){
        return res.redirect("/dashboard");
    }
  
    let data = req.body;
    let id = req.params.id;

    let exist = await guild.findOne({ id: id });
    if(!exist){
        return res.redirect("/");
    }

    if(data.channel){
        await guild.findOneAndUpdate({ id: id }, { $pull: { "settings.ignored": data.channel } });
    }

    await res.redirect(`/guild/${req.params.id}/settings`);
});

router.post("/:id/auto-moderator/modules/update", async (req, res) => {
    let gui = req.client.guilds.get(req.params.id);
    let inGuild = req.client.guilds.cache.get(req.params.id).members.find(e => e.id === req.user.id);
    let hasPermission = inGuild.permission.has("MANAGE_GUILD");
  
    if(!(req.params.id || inGuild || gui || hasPermission)){
        return res.redirect("/dashboard");
    }
  
    let data = req.body;
    let bad = data["bad"] ? true : false;
    let links = data["links"] ? true : false;
    let invites = data["invites"] ? true : false;
    let mentions = data["mentions"] ? true : false;
    let emojis = data["emojis"] ? true : false;
    let caps = data["caps"] ? true : false;
    let images = data["images"] ? true : false;
    //let spam = data["spam"] ? true : false;

    let id = req.params.id;

    let exist = await guild.findOne({ id: id });
    if(!exist){
        return res.redirect("/");
    }

    if(bad){
        await guild.findOneAndUpdate({ id: id }, { $set: { "automoderator.bad.status": true } });
    } else if(!bad){
        await guild.findOneAndUpdate({ id: id }, { $set: { "automoderator.bad.status": false } });
    }

    if(links){
        await guild.findOneAndUpdate({ id: id }, { $set: { "automoderator.links.status": true } });
    } else if(!links){
        await guild.findOneAndUpdate({ id: id }, { $set: { "automoderator.links.status": false } });
    }

    if(invites){
        await guild.findOneAndUpdate({ id: id }, { $set: { "automoderator.invites.status": true } });
    } else if(!invites){
        await guild.findOneAndUpdate({ id: id }, { $set: { "automoderator.invites.status": false } });
    }

    if(mentions){
        await guild.findOneAndUpdate({ id: id }, { $set: { "automoderator.mentions.status": true } });
    } else if(!mentions){
        await guild.findOneAndUpdate({ id: id }, { $set: { "automoderator.mentions.status": false } });
    }

    if(emojis){
        await guild.findOneAndUpdate({ id: id }, { $set: { "automoderator.emojis.status": true } });
    } else if(!emojis){
        await guild.findOneAndUpdate({ id: id }, { $set: { "automoderator.emojis.status": false } });
    }

    if(images){
        await guild.findOneAndUpdate({ id: id }, { $set: { "automoderator.images.status": true } });
    } else if(!images){
        await guild.findOneAndUpdate({ id: id }, { $set: { "automoderator.images.status": false } });
    }

    if(caps){
        await guild.findOneAndUpdate({ id: id }, { $set: { "automoderator.caps.status": true } });
    } else if(!caps){
        await guild.findOneAndUpdate({ id: id }, { $set: { "automoderator.caps.status": false } });
    }

    return res.redirect(`/guild/${req.params.id}/moderation`);
});

router.post("/:id/auto-moderator/ignored-channels/update", async (req, res) => {
    let gui = req.client.guilds.get(req.params.id);
    let inGuild = req.client.guilds.cache.get(req.params.id).members.find(e => e.id === req.user.id);
    let hasPermission = inGuild.permission.has("MANAGE_GUILD");
  
    if(!(req.params.id || inGuild || gui || hasPermission)){
        return res.redirect("/dashboard");
    }

    let data = req.body;
    let id = req.params.id;

    let exist = await guild.findOne({ id: id });
    if(!exist){
        return res.redirect("/");
    }

    if(typeof data.channels === "string"){
        let array = exist.automoderator.ignored;
        array.push(data.channels)
        let fixed = remove_duplicates(array);
        await guild.findOneAndUpdate({ id: id }, { $set: { "automoderator.ignored": fixed } });
    } else {
        for (const value of data.channels) {
          let array = exist.automoderator.ignored;
          array.push(value)
          let fixed = remove_duplicates(array);
            await guild.findOneAndUpdate({ id: id }, { $set: { "automoderator.ignored": fixed } });
        }
    }

    await res.redirect(`/guild/${req.params.id}/moderation`);
});

router.post("/:id/auto-moderator/ignored-channel/delete", async (req, res) => {
    let gui = req.client.guilds.get(req.params.id);
    let inGuild = req.client.guilds.cache.get(req.params.id).members.find(e => e.id === req.user.id);
    let hasPermission = inGuild.permission.has("MANAGE_GUILD");
  
    if(!(req.params.id || inGuild || gui || hasPermission)){
        return res.redirect("/dashboard");
    }
  
    let data = req.body;
    let id = req.params.id;

    let exist = await guild.findOne({ id: id });
    if(!exist){
        return res.redirect("/");
    }

    if(data.channel){
        await guild.findOneAndUpdate({ id: id }, { $pull: { "automoderator.ignored": data.channel } });
    }

    await res.redirect(`/guild/${req.params.id}/moderation`);
});

router.post("/:id/auto-moderator/ignored-roles/update", async (req, res) => {
    let gui = req.client.guilds.get(req.params.id);
    let inGuild = req.client.guilds.cache.get(req.params.id).members.find(e => e.id === req.user.id);
    let hasPermission = inGuild.permission.has("MANAGE_GUILD");
  
    if(!(req.params.id || inGuild || gui || hasPermission)){
        return res.redirect("/dashboard");
    }

    let data = req.body;
    let id = req.params.id;

    let exist = await guild.findOne({ id: id });
    if(!exist){
        return res.redirect("/");
    }

    if(typeof data.roles === "string"){
        let array = exist.automoderator.ignored_roles;
        array.push(data.roles)
        let fixed = remove_duplicates(array);
        await guild.findOneAndUpdate({ id: id }, { $set: { "automoderator.ignored_roles": fixed } });
    } else {
        for (const value of data.roles) {
            let array = exist.automoderator.ignored_roles;
            array.push(value)
            let fixed = remove_duplicates(array);
            await guild.findOneAndUpdate({ id: id }, { $set: { "automoderator.ignored_roles": fixed } });
        }
    }

    await res.redirect(`/guild/${req.params.id}/moderation`);
});

router.post("/:id/auto-moderator/ignored-roles/delete", async (req, res) => {
    let gui = req.client.guilds.get(req.params.id);
    let inGuild = req.client.guilds.cache.get(req.params.id).members.find(e => e.id === req.user.id);
    let hasPermission = inGuild.permission.has("MANAGE_GUILD");
  
    if(!(req.params.id || inGuild || gui || hasPermission)){
        return res.redirect("/dashboard");
    }

    let data = req.body;
    let id = req.params.id;

    let exist = await guild.findOne({ id: id });
    if(!exist){
        return res.redirect("/");
    }

    if(data.role){
        await guild.findOneAndUpdate({ id: id }, { $pull: { "automoderator.ignored_roles": data.role } });
    }

    await res.redirect(`/guild/${req.params.id}/moderation`);
});

router.post("/:id/auto-moderator/settings/update", async (req, res) => {
    let gui = req.client.guilds.get(req.params.id);
    let inGuild = req.client.guilds.cache.get(req.params.id).members.find(e => e.id === req.user.id);
    let hasPermission = inGuild.permission.has("MANAGE_GUILD");
  
    if(!(req.params.id || inGuild || gui || hasPermission)){
        return res.redirect("/dashboard");
    }

    let data = req.body;
    let mentionsRange = data.mentionsRange;
    let emojisRange = data.emojisRange;

    let id = req.params.id;

    let exist = await guild.findOne({ id: id });
    if(!exist){
        return res.redirect("/");
    }

    if(mentionsRange){
        await guild.findOneAndUpdate({ id: id }, { $set: { "automoderator.mentions.range": mentionsRange } });
    }

    if(emojisRange){
        await guild.findOneAndUpdate({ id: id }, { $set: { "automoderator.emojis.range": emojisRange } });
    }

    await res.redirect(`/guild/${req.params.id}/moderation`);
});

router.post("/:id/auto-moderator/bad/word/add", async (req, res) => {
    let gui = req.client.guilds.get(req.params.id);
    let inGuild = req.client.guilds.cache.get(req.params.id).members.find(e => e.id === req.user.id);
    let hasPermission = inGuild.permission.has("MANAGE_GUILD");
  
    if(!(req.params.id || inGuild || gui || hasPermission)){
        return res.redirect("/dashboard");
    }

    let data = req.body;
    let id = req.params.id;
    
    let exist = await guild.findOne({ id: id });
    if(!exist){
        return res.redirect("/");
    }

    if(data.word){
        let array = exist.automoderator.bad.words;
        array.push(data.word.toLowerCase())
        let fixed = remove_duplicates(array);
        await guild.findOneAndUpdate({ id: id }, { $set: { "automoderator.bad.words": fixed } }); 
    }

    await res.redirect(`/guild/${req.params.id}/moderation`);
});

router.post("/:id/auto-moderator/bad/word/delete", async (req, res) => {
    let gui = req.client.guilds.get(req.params.id);
    let inGuild = req.client.guilds.cache.get(req.params.id).members.find(e => e.id === req.user.id);
    let hasPermission = inGuild.permission.has("MANAGE_GUILD");
  
    if(!(req.params.id || inGuild || gui || hasPermission)){
        return res.redirect("/dashboard");
    }

    let data = req.body;
    let id = req.params.id;
    
    let exist = await guild.findOne({ id: id });
    if(!exist){
        return res.redirect("/");
    }

    if(data.word){
        await guild.findOneAndUpdate({ id: id }, { $pull: { "automoderator.bad.words": data.word } }); 
    }

    await res.redirect(`/guild/${req.params.id}/moderation`);
});

router.post("/:id/misc/update", async (req, res) => {
    let gui = req.client.guilds.get(req.params.id);
    let inGuild = req.client.guilds.cache.get(req.params.id).members.find(e => e.id === req.user.id);
    let hasPermission = inGuild.permission.has("MANAGE_GUILD");
  
    if(!(req.params.id || inGuild || gui || hasPermission)){
        return res.redirect("/dashboard");
    }

    let data = req.body;
    let private_guild = data["private-guild-misc"] ? true : false;
    let color = data["color"];

    let id = req.params.id;

    let exist = await guild.findOne({ id: id });
    if(!exist){
        return res.redirect("/");
    }

    if(private_guild){
        await guild.findOneAndUpdate({ id: id }, { $set: { "settings.private_guild": true } });
    } else if(!private_guild){
        await guild.findOneAndUpdate({ id: id }, { $set: { "settings.private_guild": false } });
    }

    if(color){
        let fixed = color.slice(1);
        let intColor = parseInt(fixed, 16);
        await guild.findOneAndUpdate({ id: id }, { $set: { "settings.color": intColor } });
    }

    await res.redirect(`/guild/${req.params.id}/settings`);
});

router.post("/:id/utility/other/update", async (req, res) => {
    let gui = req.client.guilds.get(req.params.id);
    let inGuild = req.client.guilds.cache.get(req.params.id).members.find(e => e.id === req.user.id);
    let hasPermission = inGuild.permission.has("MANAGE_GUILD");
  
    if(!(req.params.id || inGuild || gui || hasPermission)){
        return res.redirect("/dashboard");
    }

    let data = req.body;
    let private_guild = data["private-guild-misc"] ? true : false;

    let id = req.params.id;

    let exist = await guild.findOne({ id: id });
    if(!exist){
        return res.redirect("/");
    }

    if(private_guild){
        await guild.findOneAndUpdate({ id: id }, { $set: { "settings.private_guild": true } });
    } else if(!private_guild){
        await guild.findOneAndUpdate({ id: id }, { $set: { "settings.private_guild": false } });
    }

    await res.redirect(`/guild/${req.params.id}/utility`);
});

router.post("/:id/autorole/update", async (req, res) => {
    let gui = req.client.guilds.get(req.params.id);
    let inGuild = req.client.guilds.cache.get(req.params.id).members.find(e => e.id === req.user.id);
    let hasPermission = inGuild.permission.has("MANAGE_GUILD");
  
    if(!(req.params.id || inGuild || gui || hasPermission)){
        return res.redirect("/dashboard");
    }

    let data = req.body;

    let forMembers = data["auto-role-members"] ? true : false;
    let forBots = data["auto-role-bots"] ? true : false;

    let botRole = data["auto-role-bots-role"];
    let memberRole = data["auto-role-members-role"];

    let id = req.params.id;

    let exist = await guild.findOne({ id: id });
    if(!exist){
        return res.redirect("/");
    }
});

module.exports = router;