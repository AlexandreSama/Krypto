const Discord = require('discord.js');
const mysql = require('mysql');
const request = require(`request`);
const fs = require(`fs`);

exports.run = async (client, message, args) => {

    let guildName = message.guild.name;
    let guildNameNoSpace = guildName.replace(/\s/g, '');
    message.delete();
    let authorid = message.author.id;
    const filter = message => message.author.id == authorid;

    var connection = mysql.createConnection({
        host     : 'localhost',
        user     : 'root',
        database: guildNameNoSpace
    });

    if(message.member.hasPermission('ADMINISTRATOR')){
        message.author.send("Bonjour, quel est le nom de ton Mob ?").then(res1 => {
            res1.channel.awaitMessages(filter, {max: 1}).then(collector1 => {
                let mobName = collector1.first().content;
                message.author.send("Ok, quel est son nombre de point de vie ?").then(res2 => {
                    res2.channel.awaitMessages(filter, {max: 1}).then(collector2 => {
                        let mobLifePoints = collector2.first().content;
                        message.author.send("Ok, quel est son nombre de dégats ?").then(res3 => {
                            res3.channel.awaitMessages(filter, {max: 1}).then(collector3 => {
                                let mobAttackPoints = collector3.first().content;
                                message.author.send("Ok, quel est son nombre de défense ?").then(res4 => {
                                    res4.channel.awaitMessages(filter, {max: 1}).then(collector4 => {
                                        let mobDefensePoints = collector4.first().content;
                                        message.author.send("Ok, quel est le nombre de gold de récompense ?").then(res5 => {
                                            res5.channel.awaitMessages(filter, {max: 1}).then(collector5 => {
                                                let mobGoldRecompense = collector5.first().content;
                                                message.author.send("Ok pour finir, donne moi une image du Mob").then(res6 => {
                                                    res6.channel.awaitMessages(filter, {max: 1}).then(collector6 => {
                                                        let mobImage = collector6.first();
                                                        function download(url){
                                                            request.get(url)
                                                                .on('error', console.error)
                                                                .pipe(fs.createWriteStream('utils/img/mobs/' + mobName + '.png'));
                                                        }
                                                        download(mobImage.attachments.first().url)
                                                        connection.query(`INSERT INTO mobs (mobname, moblifepoints, mobattackpoints, mobdefensepoints, mobgoldrecompense) VALUES ("${mobName}", "${mobLifePoints}", "${mobAttackPoints}", "${mobDefensePoints}", "${mobGoldRecompense}")`, function(error, results){
                                                            if(error){
                                                                console.log(error)
                                                                connection.destroy();
                                                            }
                                                            if(results){
                                                                message.author.send("Parfait, ton mob est enregistré !")
                                                                connection.destroy();
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
            })
        })
    }else{
        message.author.send("Tu n'est pas administrateur !")
    }

}

exports.config = {
    aliases: ['addmobs'],
    name: 'addmobs',
	description: 'Ajoute un mobs de votre choix',
}