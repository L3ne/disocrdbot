const Discord = require('discord.js');
const { Client, Collection, GatewayIntentBits, EmbedBuilder, Partials, ChannelType, ButtonStyle, ButtonBuilder, ActionRowBuilder } = Discord;
const config = require('./config')
const { Player } = require('discord-player');
const client = new Client({
intents: [Object.keys(GatewayIntentBits)],
partials: [Object.keys(Partials)],
});

client.player = new Player(client, config.opt.discordPlayer);
client.player.extractors.loadDefault();

const logs = require('discord-logs');
logs(client, {
    debug: true
});

const InvitesTracker = require('@androz2091/discord-invites-tracker');
const tracker = InvitesTracker.init(client, {
    fetchGuilds: true,
    fetchVanity: true,
    fetchAuditLogs: true
});

tracker.on('guildMemberAdd', (member, type, invite) => {

  const welcomeChannel = member.guild.channels.cache.find((ch) => ch.id === '1096914159746158712');

  if(type === 'normal'){
      welcomeChannel.send(`Welcome ${member}! You were invited by <@${invite.inviter.id}>!`);
  }

  else if(type === 'vanity'){
      welcomeChannel.send(`Welcome ${member}! You joined using a custom invite!`);
  }

  else if(type === 'permissions'){
      welcomeChannel.send(`Welcome ${member}! I can't figure out how you joined because I don't have the "Manage Server" permission!`);
  }

  else if(type === 'unknown'){
      welcomeChannel.send(`Welcome ${member}! I can't figure out how you joined the server...`);
  }

});

const { GiveawaysManager } = require("discord-giveaways");
client.giveawaysManager = new GiveawaysManager(client, {
  storage: './gvw/giveaways.json',
  default: {
    botsCanWin: false,
    embedColor: "#575cc7",
    reaction: "🎉",
    lastChance: {
      enabled: true,
      content: `⚠️ **Dernière chance d'entrer**`,
      threshold: 5000,
      embedColor: '#575cc7'
    }
  }
});

client.giveawaysManager.on("giveawayReactionAdded", (giveaway, member, reaction) => {
    member.send('Votre participation a bien été prise en compte')
    console.log(`${member.user.tag} entered giveaway #${giveaway.messageId} (${reaction.emoji.name})`);
});

client.giveawaysManager.on("giveawayReactionRemoved", (giveaway, member, reaction) => {
    console.log(`${member.user.tag} unreact to giveaway #${giveaway.messageId} (${reaction.emoji.name})`);
});

client.giveawaysManager.on("giveawayEnded", (giveaway, winners) => {
    console.log(`Giveaway #${giveaway.messageId} ended! Winners: ${winners.map((member) => member.user.username).join(', ')}`);
});



client.on("messageCreate", (message) => {
  if (message.author.bot) return false;

  if (message.content.includes("noir") || message.content.includes("negro"))

  if (message.mentions.has(client.user.id)) {
 
      message.reply("nique les noir^^");
  }
});




process.on("unhandledRejection", (reason) => {
  console.log("An unhandled rejection occurred in the main process:");
  console.log(reason.stack ? `${reason.stack}` : `${reason}`);
});
process.on("uncaughtException", (err) => {
  console.log("An uncaught exception occurred in the main process:");
  console.log(err.stack ? `${err.stack}` : `${err}`);
});
process.on("uncaughtExceptionMonitor", (err) => {
  console.log("An uncaught exception monitor occurred in the main process:");
  console.log(err.stack ? `${err.stack}` : `${err}`);
});
process.on("beforeExit", (code) => {
  console.log("The process is about to exit with code: " + code);
});
process.on("exit", (code) => {
  console.log("The process exited with code: " + code);
});

client.color    = "#575cc7"
client.discord  = Discord;
client.commands = new Collection();
client.slash    = new Collection();
client.config   = require('./config');
client.cwd      = require('process').cwd();

// LOAD COMMENDS AND EVENTS
const { loadEvents } = require("./src/handlers");
const { loadCommands } = require("./src/handlers");
const { loadSlashCommands } = require("./src/handlers");



// Error Handling

client.login(config.token).then(() => {
    // LOAD COMMENDS AND EVENTS
    loadSlashCommands(client);
    loadCommands(client);
    loadEvents(client);
});;

module.exports = client;
