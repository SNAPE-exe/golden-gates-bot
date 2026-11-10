
require('dotenv').config();

const { REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');

const commands = [];
const commandsPath = path.join(__dirname, 'commands');

function loadCommands(dir) {
  for (const file of fs.readdirSync(dir)) {
    const fullPath = path.join(dir, file);

    if (fs.statSync(fullPath).isDirectory()) {
      loadCommands(fullPath);
    } else if (file.endsWith('.js')) {
      const command = require(fullPath);

      if (command.data && command.execute) {
        commands.push(command.data.toJSON());
      }
    }
  }
}

loadCommands(commandsPath);

const rest = new REST({ version: '10' })
  .setToken(process.env.BOT_TOKEN);

async function deploy() {
  try {
    console.log(`Loading ${commands.length} commands...`);

    await rest.put(
      Routes.applicationGuildCommands(
        process.env.CLIENT_ID,
        process.env.GUILD_ID
      ),
      { body: commands }
    );

    console.log('Golden Gates commands registered successfully!');
  } catch (error) {
    console.error('Command deployment failed:', error);
    process.exitCode = 1;
  }
}

if (!process.env.BOT_TOKEN ||
    !process.env.CLIENT_ID ||
    !process.env.GUILD_ID) {
  console.error('Missing required environment variables!');
  process.exit(1);
}

deploy();
