const { ApplicationCommandOptionType, escapeHeading } = require("discord.js");
const { getStandardEmbed } = require("../util/messages");

/**
 * @type {import("discord.js").ApplicationCommandData}
 */
let command = {
    name: "massrole",
    name_localizations: {
        "de": "massrole",
        "en-GB": "massrole",
        "en-US": "massrole",
    },
    description: "Give a role to all members",
    default_member_permissions: "8",
    dm_permission: false,
    options: [
        {
            type: ApplicationCommandOptionType.Role,
            name: "role",
            description: "The role to give to all members",
            required: true,
        }
    ]
}

/**
 * 
 * @param {import("discord.js").Interaction} interaction
 * @returns 
 */
let executeCommand = async function executeCommand(interaction, getLocale) {
    const { commandName, options } = interaction;
    const role = options.getRole("role");

    if (!role) {
        interaction.reply({
            content: ' ',
            embeds: [ getStandardEmbed('Please provide a valid role.') ],
            ephemeral: true,
        });
        return;
    }

    await interaction.reply({
        content: " ",
        embeds: [ getStandardEmbed(`Giving <@&${role.id}> role to all members....`) ],
        ephemeral: true,
    });

    try {
        // Fetch all members
        await interaction.guild.members.fetch();

        const members = interaction.guild.members.cache;

        let processedCount = 0;

        for (const member of members.values()) {
            if (member.roles.cache.has(role.id)) continue;
            member.roles.add(role).catch(console.error);
            processedCount++;
        }

        interaction.followUp({
            content: ' ',
            embeds: [ getStandardEmbed(`Successfully gave <@&${role.id}> role to all members.\n${processedCount}/${interaction.guild.memberCount} (${Math.round(processedCount / interaction.guild.memberCount * 100)}%) members processed.`) ],
            ephemeral: true,
        });
    } catch (error) {
        console.error('Error fetching members:', error);
        interaction.editReply({
            content: ' ',
            embeds: [ getStandardEmbed(`An error occurred while fetching members. Please try again later.`) ],
            ephemeral: true,
        });
    }
};

module.exports.command = command;
module.exports.executeCommand = executeCommand;