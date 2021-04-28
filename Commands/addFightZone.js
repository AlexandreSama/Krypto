const Discord = require('discord.js');
const mysql = require('mysql');

exports.run = async (client, message, args) => {

    let guildName = message.guild.name;
    let guildNameNoSpace = guildName.replace(/\s/g, '');
    message.delete();
    let authorid = message.author.id;
    const filter = message => message.author.id == authorid;

    var connection = mysql.createConnection({
        host     : 'localhost',
        user     : 'root',
        database: guildNameNoSpace,
        bigNumberStrings: true
    });

    if(message.member.hasPermission('ADMINISTRATOR')){
        message.author.send("Bonjour, donne moi l'id du channel FightZone ? (si tu en a plusieurs met une virgule puis un espace entre chaque id)").then(res1 => {
            res1.channel.awaitMessages(filter, {max: 1}).then(collector1 => {
                let idFightZone = collector1.first().content;
                if(idFightZone.includes(", ") == true){
                    let idFightsZone = idFightZone.split(", ")
                    idFightsZone.forEach(element => {
                        console.log(element)
                        connection.query(`INSERT INTO fightzones (idChannel) VALUES ("${element}")`, function(error, results){
                            if(error){
                                console.log(error)
                                message.author.send("Vérifie bien que tu a envoyé les id tel que : 165446444846464, 65465464489464, etc...")
                                connection.destroy();
                            }
                            if(results){
                                message.author.send("Parfait, les FightZones sont enregistrées !")
                                connection.destroy();
                            }
                        })
                    });
                }else{
                    connection.query(`INSERT INTO fightzones (idChannel) VALUES ("${idFightZone}")`, function(error, results){
                        if(error){
                            console.log(error)
                            message.author.send("Vérifie bien que tu a envoyé les id tel que : 165446444846464")
                            connection.destroy();
                        }
                        if(results){
                            message.author.send("Parfait, la FightZone est enregistré !")
                            connection.destroy();
                        }
                    })
                }
            })
        })
    }else{
        message.author.send("Tu n'est pas administrateur !")
    }

}

exports.config = {
    aliases: ['addfz'],
    name: 'addfz',
	description: 'Ajoute une fightzone de votre choix',
}