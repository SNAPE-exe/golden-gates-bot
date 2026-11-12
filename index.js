
require('dotenv').config();

const {
  Client,
  GatewayIntentBits,
  Events,
  Collection
} = require('discord.js');

const fs = require('fs');
const path = require('path');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds
  ]
});

client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');

function loadCommands(dir) {
  for (const file of fs.readdirSync(dir)) {
    const fullPath = path.join(dir, file);

    if (fs.statSync(fullPath).isDirectory()) {
      loadCommands(fullPath);
    } else if (file.endsWith('.js')) {
      const command = require(fullPath);

      if (command.data && command.execute) {
        client.commands.set(
          command.data.name,
          command
        );
      }
    }
  }
}

loadCommands(commandsPath);

client.once(Events.ClientReady, (readyClient) => {
  console.log('================================');
  console.log('       GOLDEN GATES BOT');
  console.log('================================');
  console.log(`Logged in as: ${readyClient.user.tag}`);
  console.log(`Bot ID: ${readyClient.user.id}`);
  console.log(`Commands loaded: ${client.commands.size}`);
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

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(
    interaction.commandName
  );

  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error('Command Error:', error);

    const reply = {
      content: 'An error occurred while executing this command.',
      ephemeral: true
    };

    if (interaction.replied || interaction.deferred) {
      await interaction.followUp(reply);
    } else {
      await interaction.reply(reply);
    }
  }
});

client.on(Events.Error, (error) => {
  console.error('Discord Client Error:', error);
});

if (!process.env.BOT_TOKEN) {
  console.error('ERROR: BOT_TOKEN is missing!');
  process.exit(1);
}

client.login(process.env.BOT_TOKEN);
          
