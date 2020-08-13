const router = require("express").Router();

router.get("/", (req, res) => {
    req.logout();
    res.redirect("/");
});

module.exports = router;