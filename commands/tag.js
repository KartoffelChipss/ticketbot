const { PermissionFlagsBits, ApplicationCommand} = require("discord.js");

const tags = {
    paper: {
        id: "paper",
        name: "Paper",
        title: "Incompatible Server Software",
        description: "The most common source of **LifeStealZ** not starting up is due to using Spigot rather than PaperMC, a modern-day fork! \n\nForks are usually created to add new features, fix bugs, or improve performance that the original project might not address. **PaperMC** is a fork of Spigot, designed to provide better performance and more extensive configuration options for Minecraft servers.\n\nLifeStealZ needs to use PaperMC, as it leverages specific features and optimizations exclusive to PaperMC. You can install PaperMC [**here**](https://papermc.io/downloads/paper), or follow a guide from your Server Hosting Provider!",
    },
    whitelist: {
        id: "whitelist",
        name: "Whitelist",
        title: "Whitelist Worlds",
        description: "If you're getting warning messages about Whitelisting your world, it's likely due to a configuration issue. Fortunately, this issue can be easily fixed!\n\n**Read our [Wiki](https://lsz.strassburger.dev/configuration/whitelist) for Help!**",
    }
}

/**
 * @type {import("discord.js").ApplicationCommandData}
 */
let command = {
    name: "tag",
    description: "Send a tag message",
    options: [
        {
            type: 3,
            name: "tag",
            description: "The tag name",
            required: true,
            choices: Object.keys(tags).map(tag => {
                return {
                    name: tags[tag].name,
                    value: tag,
                }
            }),
        },
        {
            type: 6,
            name: "user",
            description: "The user to mention",
            required: false,
        }
    ]
}

/**
 * 
 * @param {import("discord.js").Interaction} interaction
 * @returns 
 */
let executeCommand = async function executeCommand(interaction) {
    if (!interaction.member.roles.cache.has(require("../options.json").ticketManagerRole)) {
        interaction.reply({
            content: `<:KMC_rotesx:995387682643509329> You don't have permission to use this command!`,
            ephemeral: true,
        });
        return;
    }

    const user = interaction.options.getMember("user");
    const tag = interaction.options.getString("tag");

    interaction.reply({
        content: `${user ?? " "}`,
        embeds: [
            {
                title: tags[tag].title,
                description: tags[tag].description,
                color: 0x2B2D31,
            }
        ]
    });
}

module.exports.command = command;
module.exports.executeCommand = executeCommand;
