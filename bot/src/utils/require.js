const Eris = require("eris-additions")(require("eris"))
const user = require("../mongo/models/user");
const guild = require("../mongo/models/guild");
const formatThis = require("humanize-duration");
const c = require("../../config");
const { inspect } = require("util");
const { format } = require("./misc");

module.exports = { Eris, formatThis, user, guild, c, inspect, format };