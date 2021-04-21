const config = require('../config.json');  
const prefix = config.prefix;

exports.run = async(client, message, guild) => {

    let owner = guild.owner;
    owner.send("Bonjour, merci de m'avoir invité sur votre serveur ! Avant de pouvoir m'utiliser pleinement, vous devez me paramètrer graçe a la commande : ;settings ! Merci de votre compréhension !")

}