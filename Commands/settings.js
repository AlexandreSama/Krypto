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
                                                                connection.query(`CREATE TABLE mobs (id INT PRIMARY KEY NOT NULL AUTO_INCREMENT, nom VARCHAR(100) NOT NULL, skills JSON, pv INT NOT NULL, damage INT NOT NULL, recompense INT NOT NULL)`, function(error, results){
                                                                    if(error){
                                                                        message.channel.send("ERREUR ! veuillez contacter le créateur du bot !")
                                                                    }
                                                                    if(results){
                                                                        message.channel.send("Peut-tu me donner le nom du monstre ?").then(res4 => {
                                                                            res4.channel.awaitMessages(filter, {max:1}).then(collector4 => {
                                                                                let mobName = collector4.first().content;
                                                                                message.channel.send("Peut-tu me donner ses skills ? (retourne a la ligne pour chaque attaque)(et fait ca en 1 message stp)").then(res5 => {
                                                                                    res5.channel.awaitMessages(filter, {max: 1}).then(collector5 => {
                                                                                        let mobSkills = collector5.first().content;
                                                                                        let mobSkillsSplit = mobSkills.split(",")
                                                                                        let mobSkillsJson = JSON.stringify(mobSkillsSplit)
                                                                                        message.channel.send("Peut-tu me donner son nombre de Point de Vie ? (juste le chiffre stp)").then(res6 => {
                                                                                            res6.channel.awaitMessages(filter, {max: 1}).then(collector6 => {
                                                                                                let mobPV = collector6.first().content;
                                                                                                message.channel.send("Peut-tu me donner son nombre de dégat ? (juste le chiffre stp").then(res7 => {
                                                                                                    res7.channel.awaitMessages(filter, {max: 1}).then(collector7 => {
                                                                                                        let mobDamage = collector7.first().content;
                                                                                                        message.channel.send("Peut-tu me donner les récompenses de loot ? (ex: 14 gold)").then(res8 => {
                                                                                                            res8.channel.awaitMessages(filter, {max: 1}).then(collector8 => {
                                                                                                                let mobRecompense = collector8.first().content;
                                                                                                                connection.query(`INSERT INTO mobs (nom, skills, pv, damage, recompense) VALUES ("${mobName}", "${mobSkillsJson}", "${mobPV}", "${mobDamage}", "${mobRecompense}")`, function(error, results){
                                                                                                                    if(error){
                                                                                                                        console.log(error)
                                                                                                                    }
                                                                                                                    if(results){
                                                                                                                        message.channel.send("Bravo, tu a fini de me paramètrer")
                                                                                                                    }
                                                                                                                })
                                                                                                            })
                                                                                                        })
                                                                                                    })
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