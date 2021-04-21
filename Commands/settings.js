const Discord = require('discord.js');
const mysql = require('mysql');
exports.run = async (client, message, args) => {

    message.delete();

    let authorid = message.author.id;
    const filter = message => message.author.id == authorid;
    let guildName = message.guild.name;
    let guildNameNoEmoji = guildName.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '')
    let guildNameNoChar1 = guildNameNoEmoji.replace("'", "");
    let guildNameNoChar2 = guildNameNoChar1.replace("-", "");
    let guildNameNoChar3 = guildNameNoChar2.replace(/([-]|[']|[>]|[<]|[/]|[|][!]|[?]|[你好]|[!]|[|])/g, '');
    let guildNameNoSpace = guildNameNoChar3.replace(/\s/g, '');

    var connection = mysql.createConnection({
        host     : 'localhost',
        user     : 'root',
    });
    connection.connect();

    let guildID = message.guild.id;

    if(message.guild.ownerID !== message.author.id){
        message.channel.send("Désolé, mais tu n'est pas le propriètaire de ce serveur !")
    }else{
        connection.query(`CREATE DATABASE ${guildNameNoSpace}`, function(error, results){
            if(error){
                console.log(error)
                message.channel.send("ERREUR ! Veuillez contacter le créateur du bot !")
            }
            if(results){
                message.channel.send("Peut tu me donner l'ID du channel de bienvenue ?").then(res1 => {
                    res1.channel.awaitMessages(filter, {max:1}).then(collector1 => {
                        let idWelcomeChannel = collector1.first().content;
                        message.channel.send("Peut-tu me donner l'ID du channel d'au-revoir ?").then(res2 => {
                            res2.channel.awaitMessages(filter, {max:1}).then(collector2 => {
                                let idGoodbyeChannel = collector2.first().content;
                                message.channel.send("Peut-tu me donner l'ID du channel de présentation ?").then(res3 => {
                                    res3.channel.awaitMessages(filter, {max:1}).then(collector3 => {
                                        let idPresentationsChannel = collector3.first().content;
                                        connection.query(`USE ${guildNameNoSpace}`, function(error, results){
                                            if(error){
                                                console.log(error)
                                                message.channel.send("ERREUR ! veuillez contacter le créateur du bot !")
                                            }
                                            if(results){
                                                connection.query(`CREATE TABLE settings (id INT PRIMARY KEY NOT NULL AUTO_INCREMENT, idWelcomeChannel TEXT NOT NULL, idGoodbyeChannel TEXT NOT NULL, idPresentationsChannel TEXT NOT NULL)`, function(error, results){
                                                    if(error){
                                                        message.channel.send("ERREUR ! veuillez contacter le créateur du bot !")
                                                    }
                                                    if(results){
                                                        connection.query(`INSERT INTO settings (idWelcomeChannel, idGoodbyeChannel, idPresentationsChannel) VALUES ("${idWelcomeChannel}", "${idGoodbyeChannel}", "${idPresentationsChannel}")`, function(error, results){
                                                            if(error){
                                                                message.channel.send("ERREUR ! veuillez contacter le créateur du bot !")
                                                            }
                                                            if(results){
                                                                message.channel.send("Informations sauvegardés avec succés !")
                                                            }
                                                        })
                                                    }
                                                })
                                            }
                                        })
                                    })
                                })
                            })
                        })
                    })
                })
            }
        })
    }

}

exports.config = {
    aliases: ['settings'],
    name: 'settings',
	description: 'Intégre les paramètres dans une BD',
}