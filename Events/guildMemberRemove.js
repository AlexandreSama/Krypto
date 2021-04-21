const config = require('../config.json');  
const prefix = config.prefix;
const mysql = require('mysql')

exports.run = async(client, message, member) => {    
    
    let guildName = member.guild.name;
    let guildNameNoEmoji = guildName.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '')
    let guildNameNoChar1 = guildNameNoEmoji.replace("'", "");
    let guildNameNoChar2 = guildNameNoChar1.replace("-", "");
    let guildNameNoChar3 = guildNameNoChar2.replace(/([-]|[']|[>]|[<]|[/]|[|][!]|[?]|[你好]|[!]|[|])/g, '');
    let guildNameNoSpace = guildNameNoChar3.replace(/\s/g, '');

    var connection = mysql.createConnection({
        host     : 'localhost',
        user     : 'root',
    });

    connection.query(`USE ${guildNameNoSpace}`, function(error, results){
        if(error){
            console.log(error)
        }
        if(results){
            connection.query("SELECT idGoodbyeChannel FROM settings", function(error, results){
                if(error){
                    console.log(error)
                }if(results){
                    let channelPresentationData = JSON.parse(JSON.stringify(results));
                    channelPresentationData.forEach( async function(data, index) {
                        const channel = member.guild.channels.cache.get(data.idPresentationsChannel);
                        if (!channel) return;

                        const canvas = Canvas.createCanvas(700, 250);
                        const ctx = canvas.getContext('2d');

                        const background = await Canvas.loadImage('../utils/img/wallpaper.png');
                        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

                        ctx.strokeStyle = '#74037b';
                        ctx.strokeRect(0, 0, canvas.width, canvas.height);

                        // Slightly smaller text placed above the member's display name
                        ctx.font = '28px sans-serif';
                        ctx.fillStyle = '#ffffff';
                        ctx.fillText('A bientôt,', canvas.width / 2.5, canvas.height / 3.5);

                        // Add an exclamation point here and below
                        ctx.font = applyText(canvas, `${member.displayName}!`);
                        ctx.fillStyle = '#ffffff';
                        ctx.fillText(`${member.displayName}!`, canvas.width / 2.5, canvas.height / 1.8);

                        ctx.beginPath();
                        ctx.arc(125, 125, 100, 0, Math.PI * 2, true);
                        ctx.closePath();
                        ctx.clip();

                        const avatar = await Canvas.loadImage(member.user.displayAvatarURL({ format: 'jpg' }));
                        ctx.drawImage(avatar, 25, 25, 200, 200);

                        const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'welcome-image.png');

                        channel.send(`A bientôt, ${member}!`, attachment)
                    })
                }
            })
        }
    })
}