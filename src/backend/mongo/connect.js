const config = require("../../../config.json");
const mongoose = require("mongoose");

mongoose.connect(config.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
})
.then(() => console.log("Database connected."))
.catch((e) => console.log(e));