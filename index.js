require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const bot = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.MessageContent,
    ],
});

bot.once('ready', () => {
    console.log(`Logged in as ${bot.user.tag}!`);
});

bot.on('messageCreate', async (message) => {
    // Ignore messages from the bot itself
    if (message.author.bot) return;

    // Handling !message command
    if (message.content.startsWith('!message')) {
        const msgContent = message.content.slice('!message'.length).trim();
        if (msgContent) {
            await message.channel.send(msgContent);
            await message.delete().catch(error => console.error('Failed to delete the message:', error));
        } else {
            await message.channel.send('You need to provide a message to repeat. Usage: `!message Your message here`');
        }
    }

    // Handling !poll command
    if (message.content.startsWith('!poll')) {
        const pollContent = message.content.slice('!poll'.length).trim();
        if (pollContent) {
            // Send the poll message
            const pollMessage = await message.channel.send(pollContent);
            // React with both options
            await pollMessage.react('✅');
            await pollMessage.react('❌');

            // Delete the original message
            await message.delete().catch(error => console.error('Failed to delete the message:', error));
        } else {
            await message.channel.send('You need to provide a message for the poll. Usage: `!poll Your question here`');
        }
    }
});

// Log the bot in using the token from your .env file
bot.login(process.env.DISCORD_TOKEN);
