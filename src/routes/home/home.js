const router = require("express").Router();
const user = require("../../backend/mongo/models/user/user");
const guild = require("../../backend/mongo/models/guild/guild");

router.get("/", async (req, res) => {

    if (req.query.guild_id) {
        return res.redirect(`/guild/${req.query.guild_id}`);
    }

    let user_fetched = null;

    try {
        if (req.isAuthenticated()) {
            user_fetched = await req.client.getRESTUser(req.user.id);
        }
    } catch (error) {
        console.error(error);
    }

    let shardsCount = 0;
    let usersCount = 0;
    let guildsCount = 0;

    if (req.client && req.client.shards) {
        shardsCount = req.client.shards.size || 0;
    }

    if (req.client && req.client.users) {
        usersCount = req.client.users.size || 0;
    }

    if (req.client && req.client.guilds) {
        guildsCount = req.client.guilds.size || 0;
    }

    res.render("index", {
        id: (req.isAuthenticated() ? `${req.user.id}` : false),
        avatar: (req.isAuthenticated() ? `https://cdn.discordapp.com/avatars/${req.user.id}/${user_fetched?.avatar}.png?size=2048` : null),
        show: (req.isAuthenticated() ? true : false),
        shards: shardsCount,
        users: usersCount,
        guilds: guildsCount,
    });
});

module.exports = router;
