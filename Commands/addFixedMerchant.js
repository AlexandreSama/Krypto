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
        message.author.send("Bonjour, quel est le nom de ton marchand ? (ex: marchand d'arme)").then(res1 => {
            res1.channel.awaitMessages(filter, {max: 1}).then(collector1 => {
                let merchandname = collector1.first().content;
                message.author.send("Ok, ou se trouve t'il ? (donne moi l'id du channel ou se trouvera le marchand)").then(res2 => {
                    res2.channel.awaitMessages(filter, {max: 1}).then(collector2 => {
                        let merchandlocationid = collector2.first().content;
                        message.author.send("Ok, quel est son montant d'or actuel ?").then(res3 => {
                            res3.channel.awaitMessages(filter, {max: 1}).then(collector3 => {
                                let merchantgold = collector3.first().content;
                                message.author.send("Ok, maintenant je vais te donner le nom de chaque type d'objets présent dans le rp ! Juste après, dit moi ce que vend ce marchant ! (exemple : armes)").then(res4 => {
                                    res4.channel.awaitMessages(filter, {max: 1}).then(collector4 => {
                                        let merchandtypemarchandise = collector4.first().content;
                                        message.author.send("Ok pour finir, donne moi une image du marchand").then(res6 => {
                                            res6.channel.awaitMessages(filter, {max: 1}).then(collector6 => {
                                                let merchandImage = collector6.first();
                                                function download(url){
                                                    request.get(url)
                                                        .on('error', console.error)
                                                        .pipe(fs.createWriteStream('utils/merchandImg/' + merchandname + '.png'));
                                                }
                                                download(merchandImage.attachments.first().url)
                                                connection.query(`INSERT INTO merchand (merchandname, merchandlocationid, merchantgold, merchandtypemarchandise) VALUES ("${merchandname}", "${merchandlocationid}", "${merchantgold}", "${merchandtypemarchandise}")`, function(error, results){
                                                    if(error){
                                                        console.log(error)
                                                    }
                                                    if(results){
                                                        message.author.send("Parfait, ton marchand est enregistré !")
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
    }else{
        message.author.send("Tu n'est pas administrateur !")
    }

}

exports.config = {
    aliases: ['addfm'],
    name: 'addfm',
	description: 'Ajoute un marchand fixe de votre choix',
}