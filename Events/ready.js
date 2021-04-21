exports.run = async (client, message) => {
    client.user.setActivity({name: "Bunny ou BiboxxD ? Tel est la question", type: "PLAYING"});
    console.log("Je suis prêt !");
}