const config = require("../../config.json");

const DiscordStrategy = require("passport-discord").Strategy;
const passport = require("passport");

const xuser = require("../backend/mongo/models/user/user");

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    let existUser = await xuser.findOne({ id: id });

    if (existUser) done(null, existUser);
});

passport.use(new DiscordStrategy({
    clientID: config.CLIENT_ID,
    clientSecret: config.CLIENT_SECRET,
    callbackURL: config.CLIENT_REDIRECT,
    scope: ["identify", "guilds"]
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const isUser = await xuser.findOne({ id: profile.id });
        if (isUser) {

            await xuser.findOneAndUpdate({ id: profile.id }, { $set: { guilds: profile.guilds }})
            done(null, isUser);
        } else {
            const newUser = new xuser({
                id: profile.id,
                guilds: profile.guilds
            });

            let savedU = await newUser.save();
            done(null, savedU);
        }
    } catch (err) {
        console.log(err);
        done(err, null);
    }
}));