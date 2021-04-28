exports.run = async (client, message) => {
    client.user.setActivity({name: "Entrain de manger un biscuit avec Biscuit, Marcus et Alexandre", type: "PLAYING"});
    console.log("Je suis prêt !");
}