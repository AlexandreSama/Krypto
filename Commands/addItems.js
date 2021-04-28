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
    function download(url, name){
        request.get(url)
            .on('error', console.error)
            .pipe(fs.createWriteStream('utils/img/items/' + name + '.png'));
    }

    var connection = mysql.createConnection({
        host     : 'localhost',
        user     : 'root',
        database: guildNameNoSpace,
        bigNumberStrings: true
    });

    if(message.member.hasPermission('ADMINISTRATOR')){
        message.author.send("Bonjour, quel est le nom l'item ?").then(res1 => {
            res1.channel.awaitMessages(filter, {max: 1}).then(collector1 => {
                let itemName = collector1.first().content;
                message.author.send("Ok, peut-tu me donner une description de l'item ?").then(res2 => {
                    res2.channel.awaitMessages(filter, {max: 1}).then(collector2 => {
                        let itemDescription = collector2.first().content;
                        message.author.send("Ok, Peut-tu me donner son nombre de dégats ? (met 0 si ce n'est pas une arme)").then(res3 => {
                            res3.channel.awaitMessages(filter, {max: 1}).then(collector3 => {
                                let responseAttack = collector3.first().content;
                                    message.author.send("Ok, peut-tu me donner son nombre de défense ? (met un 0 si ce n'est pas une armure)").then(res4 => {
                                        res4.channel.awaitMessages(filter, {max: 1}).then(collector4 => {
                                            let responseDefense = collector4.first().content;
                                                message.author.send("Ok, dit moi quel est ce type d'objet ? (arme, armure, potion, bric-a-brac)").then(res5 => {
                                                    res5.channel.awaitMessages(filter, {max: 1}).then(collector5 => {
                                                        let itemType = collector5.first().content;
                                                        message.author.send("Ok, donne moi son prix de vente s'il te plait").then(res6 => {
                                                            res6.channel.awaitMessages(filter, {max: 1}).then(collector6 => {
                                                                let itemSellPrice = collector6.first().content;
                                                                message.author.send("Bien maintenant donne moi son prix d'achat s'il te plait").then(res7 => {
                                                                    res7.channel.awaitMessages(filter, {max: 1}).then(collector7 => {
                                                                        let itemBuyPrice = collector7.first().content;
                                                                        message.author.send("Pour finir, donne moi une image de l'item s'il te plait").then(res8 => {
                                                                            res8.channel.awaitMessages(filter, {max: 1}).then(collector8 => {
                                                                            let itemImage = collector8.first();
                                                                            download(itemImage.attachments.first().url, itemName)
                                                                            connection.query(`INSERT INTO items (name, description, damage, defense, type, sellprice, buyprice) VALUES ("${itemName}", "${itemDescription}", "${responseAttack}", "${responseDefense}", "${itemType}", "${itemSellPrice}", "${itemBuyPrice}")`, function(error, results){
                                                                            if(error){
                                                                                console.log(error)
                                                                                connection.destroy()
                                                                            }
                                                                            if(results){
                                                                                message.author.send("Item bien enregistré !")
                                                                                connection.destroy()
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
                    })
                })
            })
        })
    }else{
        message.author.send("Tu n'est pas administrateur !")
    }
}

exports.config = {
    aliases: ['additem'],
    name: 'additem',
	description: 'Ajoute une safezone de votre choix',
}