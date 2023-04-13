const { prefix, token, mcUsername, mcPassword, serverName } = require('./botconfig.json');
const Discord = require("discord.js");
const discordClient = new Discord.Client();
const fs = require('fs');
const mineflayer = require('mineflayer')


var killet, relayChannel, botChannel, defaultEmbed;
var MCLoggedIn = false;
var DCLoggedIn = false;

discordClient.on("ready", async () => {
    DCLoggedIn = true;
    relayChannel = await discordClient.channels.cache.get('1095111704892948551');
    botChannel = await discordClient.channels.fetch('1095111541679992953');
    killet = await discordClient.users.cache.find(u => u.id === "501885489683628036");
    console.log("CyBot Online! Comments/Questions? Email KilletStarborn@gmail.com! \n Bot is running on user: " + discordClient.user + "\n Coded by: " /*+ author + "\n Version: " + version*/ )    

    defaultEmbed = new Discord.MessageEmbed()
    .setThumbnail(`https://mc-heads.net/body/killet/left`)
    .setColor('#681482')
    .setURL('')
    .setTimestamp()
    .setFooter( 'KilletBot™ HQ',  killet.avatarURL());

});


function isAdmin(userID) {
    if(userID == -1) return false;
}

discordClient.on("message", async message => {
    message.content = message.content.toLowerCase();

    if(message.channel.id != '1095111541679992953' && message.channel.id != '1095111704892948551' ) return;


    switch(message.content){
        case '>login':
            try {
                if(!MCLoggedIn) {
                    message.channel.send('Logging in.....');
                    let mcBot = mineflayer.createBot({
                        host: serverName,
                        username: mcUsername, 
                        auth: 'microsoft', 
                        password: mcPassword       
                    })

                    mcBot.on('kicked', (error) => {
                        console.log("Bot Kicked! \n-------------------------" +error+ "-------------------------");
                        MCLoggedIn = false;
                        botChannel.send('-\n*Ingame bot kicked!* -\n-----' + error + '----\n-');
                    })

                    mcBot.on('error', (error) => {
                        console.log("Bot Kicked! \n-------------------------" +error+ "-------------------------");
                        MCLoggedIn = false;
                        botChannel.send('-\n*Ingame bot ERROR!* -\n-----' + error + '----\n-');
                    })

                    mcBot.once('spawn', () => {
                        message.channel.send(`Logged in successfully to ${serverName} on account "${mcBot.username}"~!`);
                    })

                    MCLoggedIn = true;
                    
                    mcBot.on('chat', (username, chatMessage) => {
                        var pings = '';
                        if(username === mcBot.username) return;
                        var chatEmbed = new Discord.MessageEmbed()
                        .setThumbnail(`https://mc-heads.net/body/${username}`)
                        .addField(username, chatMessage, true);
                        relayChannel.send(chatEmbed);
                    });


                } else message.channel.send('Already logged in.');


            } catch(err) {
                message.channel.send("Error! Check console.");
                console.log(err);
            }
            break;
        
        case '>test':
            message.channel.send('logged.');
            message.channel.send(defaultEmbed);
            break;

        case '>loginoverride': 
            message.channel.send('done.')
            MCLoggedIn = false;

    }
});

discordClient.login(token);