const Discord = require('discord.js');
const client = new Discord.Client();
client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
client.events = new Discord.Collection();
let message = new Discord.Message();
const fs = require('fs');
const { Player } = require("discord-music-player");
const player = new Player(client, {
    leaveOnEmpty: false,
});
client.player = player;

const config = require('./config.json');

fs.readdir("./Commands/", (err, files) => {
    if (err) return console.log(err);
    files.forEach(file => {
        if (!file.endsWith(".js")) return;
        let props = require(`./Commands/${file}`);
        console.log("Commande : " + file + " chargé avec succés !")
        let commandName = file.split(".")[0];
        client.commands.set(commandName, props);
    });
});
    //Events "handler"
    fs.readdir('./Events/', (err, files) => {
        if (err) console.log(err);
        files.forEach(file => {
            let eventFunc = require(`./Events/${file}`);
            console.log("Event : " + file + " chargé avec succés !")
            let eventName = file.split(".")[0];
            client.on(eventName, (guild, member, args) => eventFunc.run(client, guild, member, args));
        });
});
client.login(config.token);