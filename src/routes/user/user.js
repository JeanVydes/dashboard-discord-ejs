const router = require("express").Router();
const user = require("../../backend/mongo/models/user/user");
const { isAuth } = require("../../utils/misc");

router.get("/:id", async function(req, res) {
    let xuser = await user.findOne({ id: req.params.id });
    if(!xuser){
        res.redirect("/")
    }

    let user_fetched;
    let new_user = (data) => { 
       user_fetched = data;
    };
    await req.client.users.cache.get(req.params.id);
  
    let the_user_fetched;
    if(req.isAuthenticated()){
      let the_new_user = (data) => { 
         the_user_fetched = data;
      };
      await req.client.users.cache.get(req.user.id); 
    }

    res.render("user", {
        user_id: `${user_fetched.id}`,
        username: `${user_fetched.username}`,
        discriminator: `${user_fetched.discriminator}`,
        theavatar: `https://cdn.discordapp.com/avatars/${user_fetched.id}/${user_fetched.avatar}.png?size=2048`,
        avatar: (req.isAuthenticated() ? `https://cdn.discordapp.com/avatars/${req.user.id}/${the_user_fetched.avatar}.png?size=2048` : null),
        show: (req.isAuthenticated() ? true : false),
        id: (req.isAuthenticated() ? req.user.id : null),
        flags: user_fetched.flags
    });
});

router.get("/:id/editing", isAuth, async function(req, res) {


    let xuser = await user.findOne({ id: req.params.id });
    if(!xuser){
        res.redirect("/")
    }
  
    if(req.user.id !== req.params.id){
      res.redirect(`/user/${req.user.id}`)
    }
  
    let user_fetched = req.client.users.cache.get(req.params.id);
    if(!user_fetched) {
      return res.redirect("/")
    }

    res.render("edit", {
        id: `${user_fetched.id}`,
        username: `${user_fetched.username}`,
        avatar: `https://cdn.discordapp.com/avatars/${user_fetched.id}/${user_fetched.avatar}.png?size=2048`,
        show: (req.isAuthenticated() ? "block" : "none"),
        showlogin: (req.isAuthenticated() ? "none" : "block"),
        flags: user_fetched.flags
    });
});

module.exports = router;