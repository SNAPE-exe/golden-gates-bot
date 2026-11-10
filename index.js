
require('dotenv').config();

const {
  Client,
  GatewayIntentBits,
  Events
} = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds
  ]
});

client.once(Events.ClientReady, (readyClient) => {
  console.log('================================');
  console.log('       GOLDEN GATES BOT');
  console.log('================================');
  console.log(`Logged in as: ${readyClient.user.tag}`);
  console.log(`Bot ID: ${readyClient.user.id}`);
  console.log('Status: ONLINE');
  console.log('================================');

  readyClient.user.setPresence({
    activities: [
      {
        name: 'Golden Gates',
        type: 0
      }
    ],
    status: 'online'
  });
});

client.on(Events.Error, (error) => {
  console.error('Discord Client Error:', error);
});

if (!process.env.BOT_TOKEN) {
  console.error('ERROR: BOT_TOKEN is missing!');
  process.exit(1);
}

client.login(process.env.BOT_TOKEN);
