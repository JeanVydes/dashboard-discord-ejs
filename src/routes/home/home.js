const router = require("express").Router();
const user = require("../../backend/mongo/models/user/user");
const guild = require("../../backend/mongo/models/guild/guild");

router.get("/", async (req, res) => {

    if(req.query.guild_id){
        return res.redirect(`/guild/${req.query.guild_id}`)
    }
  
    let user_fetched;
    let new_user = (data) => { 
       user_fetched = data;
    };
  
    if(req.isAuthenticated()){
      await req.client.getRESTUser(req.user.id).then((e) => new_user(e));
    }

    res.render("index", {
        id: (req.isAuthenticated() ? `${req.user.id}` : false),
        avatar: (req.isAuthenticated() ? `https://cdn.discordapp.com/avatars/${req.user.id}/${user_fetched.avatar}.png?size=2048` : null),
        show: (req.isAuthenticated() ? true : false),
        shards: req.client.shards.size,
        users: req.client.users.size,
        guilds: req.client.guilds.size,
    })
});

module.exports = router;