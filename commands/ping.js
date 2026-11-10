
const {
  SlashCommandBuilder,
  EmbedBuilder
} = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Check Golden Gates bot latency'),

  async execute(interaction) {
    const latency = Date.now() - interaction.createdTimestamp;

    const embed = new EmbedBuilder()
      .setColor(0xD4AF37)
      .setTitle('⚜️ Golden Gates | Pong!')
      .setDescription('Golden Gates is online and responding!')
      .addFields(
        {
          name: 'Bot Latency',
          value: `${latency}ms`,
          inline: true
        },
        {
          name: 'API Latency',
          value: `${Math.round(interaction.client.ws.ping)}ms`,
          inline: true
        }
      )
      .setTimestamp()
      .setFooter({
        text: 'Golden Gates Management'
      });

    await interaction.reply({
      embeds: [embed]
    });
  }
};
