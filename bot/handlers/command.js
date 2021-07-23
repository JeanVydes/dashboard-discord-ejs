const { readdirSync } = require("fs");

module.exports = (bitch) => {
    readdirSync("./src/commands/").map(dir => {
       const commands = readdirSync(`./src/commands/${dir}/`).map(cmd=>{
           let pull = require(`../commands/${dir}/${cmd}`)
           console.log(`Loaded command ${pull.name}`)
           bitch.commands.set(pull.name,pull)
           if(cmd.aliases){
               cmd.aliases.forEach(p=>{
                bitch.aliases.set(p,pull)
               })
           }
       })
    })
}