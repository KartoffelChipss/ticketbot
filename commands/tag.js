const { PermissionFlagsBits } = require("discord.js");

let command = {
    name: "tag",
    description: "Send a tag message",
    options: [
        {
            type: 1,
            name: "paper",
            description: "Send a PaperMC compatibility message",
            options: [
                {
                    type: 6, // USER type
                    name: "user",
                    description: "The user to ping",
                    required: true
                }
            ]
        },
        {
            type: 1,
            name: "whitelist",
            description: "Send a whitelist configuration message",
            options: [
                {
                    type: 6, // USER type
                    name: "user",
                    description: "The user to ping",
                    required: true
                }
            ]
        }
    ]
}

/**
 * 
 * @param {import("discord.js").Interaction} interaction
 * @returns 
 */
let executeCommand = async function executeCommand(interaction) {
    if (!interaction.member.roles.cache.has('990304218751590460')) {
        interaction.reply({
            content: `<:KMC_rotesx:995387682643509329> You don't have permission to use this command!`,
            ephemeral: true,
        });
        return;
    }

    const user = interaction.options.getUser('user');
    let embedMessage = {};

    if (interaction.options.getSubcommand() === "paper") {
        embedMessage = {
            content: `${user}`,
            tts: false,
            embeds: [
                {
                    id: 652627557,
                    title: "Incompatible Server Software",
                    description: "The most common source of **LifeStealZ** not starting up is due to using Spigot rather than PaperMC, a modern-day fork! \n\nForks are usually created to add new features, fix bugs, or improve performance that the original project might not address. **PaperMC** is a fork of Spigot, designed to provide better performance and more extensive configuration options for Minecraft servers.\n\nLifeStealZ needs to use PaperMC, as it leverages specific features and optimizations exclusive to PaperMC. You can install PaperMC [**here**](https://papermc.io/downloads/paper), or follow a guide from your Server Hosting Provider!",
                    color: 11233781,
                    fields: []
                }
            ],
            components: [],
            actions: {}
        };
    }

    if (interaction.options.getSubcommand() === "whitelist") {
        embedMessage = {
            content: `${user}`,
            tts: false,
            embeds: [
                {
                    id: 652627557,
                    title: "Whitelist Worlds",
                    description: "If you're getting warning messages about Whitelisting your world, it's likely due to a configuration issue. Fortunately, this issue can be easily fixed!\n\n**Read our [Wiki](https://lsz.strassburger.dev/configuration/whitelist) for Help!**",
                    color: 11233781,
                    fields: []
                }
            ],
            components: [],
            actions: {}
        };
    }

    interaction.reply(embedMessage);
}

module.exports.command = command;
module.exports.executeCommand = executeCommand;
