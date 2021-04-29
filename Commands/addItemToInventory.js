const Discord = require('discord.js');
const mysql = require('mysql');

exports.run = async (client, message, args) => {

    let guildName = message.guild.name;
    let guildNameNoSpace = guildName.replace(/\s/g, '');
    message.delete();
    let authorid = message.author.id;
    const filter = message => message.author.id == authorid;
    let authorName = message.author.username
    let authorNameNoSpace = authorName.toLowerCase();
    console.log(authorNameNoSpace)

    var connection = mysql.createConnection({
        host     : 'localhost',
        user     : 'root',
        database: guildNameNoSpace,
        bigNumberStrings: true
    });

    if(message.member.hasPermission('ADMINISTRATOR')){
        message.author.send("Bonjour, quel est l'id de l'item que tu souhaite ajouter ?").then(res1 => {
            connection.query(`SELECT * FROM items`, function(error, results){
                if(error){
                    console.log(error)
                }
                if(results){
                    results.forEach(element => {
                        message.author.send(`
                           **id de l'item** : ${element.id}
                        \n **nom de l'item** : ${element.name} 
                        \n **description de l'item** : ${element.description} 
                        \n **dégats de l'item** : ${element.damage} 
                        \n **défense de l'item** : ${element.defense} 
                        \n **type de l'item** : ${element.type}
                        \n **cout de vente de l'item** : ${element.sellprice}
                        \n **cout d'achat de l'item** : ${element.buyprice}`)
                        const attachment = new Discord.MessageAttachment('utils/img/items/' + element.name + '.png');
                        message.author.send(attachment)
                        message.author.send('------------------------------------------------')
                    })
                    res1.channel.awaitMessages(filter, {max: 1}).then(collector1 => {
                        let itemID = collector1.first().content;
                        connection.query(`SELECT * FROM items WHERE id = ${itemID}`, function(error, resultss){
                            if(error){
                                console.log(error)
                            }
                            if(resultss){
                                resultss.forEach(elements => {
                                    connection.query(`UPDATE ${authorNameNoSpace} SET inventory = JSON_MODIFY(inventory, 'append $', JSON_QUERY(N'{"${elements.name}": {"description": "${elements.description}", "ap": "${elements.damage}", "dp": "${elements.defense}"}}'))`, function(error, results){
                                    if(error){
                                        console.log(error)
                                    }
                                    if(results){
                                        message.author.send("Item ajouté !")
                                    }
                                    })
                                })
                            }
                        })
                    })
                }
            })
        })
    }else{
        message.author.send("Tu n'est pas administrateur !")
    }
}

exports.config = {
    aliases: ['addItemToInventory'],
    name: 'additv',
	description: 'Ajoute une safezone de votre choix',
}

[{"Lame-Tonnerre": {"ap": "200", "dp": "0"}}]