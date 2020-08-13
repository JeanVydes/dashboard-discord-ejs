const { CLIENT_URL } = require("../../../config.json");

const router = require("express").Router();
const passport = require("passport");

router.get("/", passport.authenticate("discord")/*(req, res) => {
  res.redirect("https://discord.com/oauth2/authorize?response_type=code&redirect_uri=https%3A%2F%2Fbotjean.glitch.me%2Fauth%2Fredirect&scope=identify%20guilds&client_id=732305355819843615")
}*/);
router.get("/redirect", passport.authenticate("discord", {
    failureRedirect: "/",
    successRedirect: "/"
}));

module.exports = router;