const Discord = require('discord.js');

exports.run = async (client, message, args) => {

    message.delete();
    let authorid = message.author.id;
    const filter = message => message.author.id == authorid;

}

exports.config = {
    aliases: ['combat'],
    name: 'combat',
	description: 'Lance un combat contre un Player',
}