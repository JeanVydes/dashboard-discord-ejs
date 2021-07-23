const mongoose = require("mongoose");
const c = require("../../config");

mongoose.connect(process.env.MONGO, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
})
.then(db => console.log("Connected to Mongoose."))
.catch(err => console.log(err));
