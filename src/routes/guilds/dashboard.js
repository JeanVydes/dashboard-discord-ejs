const router = require("express").Router();
let guild = require("../../backend/mongo/models/guild/guild");

router.get("/", async function(req, res) {

    let user_fetched;
    let new_user = (data) => { 
       user_fetched = data;
    };
    await req.client.users.cache.get(req.user.id); 
  
    let myGuilds= req.user.guilds.cache.filter(e => e.permissions === 2147483647);

    res.render("dashboard", {
        id: (req.isAuthenticated() ? `${req.user.id}` : false),
        username: (req.isAuthenticated() ? `${user_fetched.username}` : false),
        avatar: (req.isAuthenticated() ? `https://cdn.discordapp.com/avatars/${req.user.id}/${user_fetched.avatar}.png?size=2048` : null),
        show: (req.isAuthenticated() ? true : false),

        bot: req.client,

        guilds: myGuilds,
    });
});


module.exports = router;