const router = require("express").Router();

router.get("/status", async function(req, res) {
    res.json({
      status: 200
    });
});

module.exports = router;