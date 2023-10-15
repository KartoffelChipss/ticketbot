const { Client, Intents, User, GatewayIntentBits, Interaction, Constants, Collection, PermissionFlagsBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, SelectMenuBuilder, ModalBuilder, TextInputBuilder, ActivityType, AutoModerationActionExecution } = require("discord.js");
const client = new Client({ partials: ["CHANNEL"], intents: 1537 });
require("dotenv").config();
const path = require('node:path');
const fs = require("fs");
const chalk = require("chalk");
const options = require("./options.json");
const mongoose = require("mongoose");

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args));
    }
}

if (process.env.DEVMODE === "true") {
    console.log(chalk.default.red("Bot started in development mode!"))
}

mongoose.connect(process.env.MONGOURI, {
    keepAlive: true
}).then(() => console.log(chalk.default.greenBright("Connected to database")));

client.once("ready", async () => {
    /* --- Send confirmation messages --- */
    console.log(chalk.default.greenBright(`${chalk.default.yellow(client.user.tag)} is now online!`));
    console.log(chalk.default.greenBright(`${chalk.default.yellow(client.user.tag)} is on ${chalk.default.yellow(client.guilds.cache.size)} servers!`));

    client.user.setPresence({
        activities: [{ name: `your Tickets`, type: ActivityType.Watching }],
        status: 'online',
    });

    /* --- Register commands --- */
    const guildId = options.guildId;
    const guild = client.guilds.cache.get(guildId);
    let commands = guild.commands;

    const commandsPath = path.join(__dirname, 'commands');
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const commandFile = require(filePath);
        commands.create(commandFile.command)
    }
});

client.on("error", (err) => {
    console.log(err);
});
client.on("warn", console.warn);

client.login(process.env.TOKEN);