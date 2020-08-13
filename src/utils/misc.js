const express = require("express").Router();

function isAuth(req, res, next){
    if(req.user){
        next();
    } else {
        res.redirect("/auth")
    }
}

module.exports = { isAuth };