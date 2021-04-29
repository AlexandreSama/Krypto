const config = require('../config.json');  
const prefix = config.prefix;
const Discord = require('discord.js');
const mysql = require('mysql');

exports.run = async(client, message) => {
  if (message.author.bot) return;
  if (message.content.startsWith(config.prefix)) {

    
 let messageArray = message.content.split(" "),
     cmd = messageArray[0],
     args = messageArray.slice(1),
     commandfile = client.commands.get(cmd.slice(config.prefix.length)) || client.aliases.get(cmd.slice(config.prefix.length));
  
if(!commandfile) return;    
    commandfile.run(client,message,args, prefix);             
  }
  let guildName = message.guild.name;
  let guildNameNoSpace = guildName.replace(/\s/g, '');
  let channelId = message.channel.id;
  var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    database: guildNameNoSpace,
    bigNumberStrings: true,
    supportBigNumbers: true
  });

  connection.query(`SELECT merchandlocationid, merchandActivationPhrase FROM merchand`, function(error, results){
    if(error){
      console.log(error)
    }
    if(results){
      results.forEach((element) => {
        if(channelId === element.merchandlocationid & message.content === element.merchandActivationPhrase){
          console.log("C'est le bon channel")
          connection.destroy()
        }
        else{
          console.log("pas le bon channel")
          connection.destroy()
        }
      });
    }
  })
}