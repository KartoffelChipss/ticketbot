const { ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const { ActionRowBuilder } = require('@discordjs/builders');

function getModal(projectID) {
    const modal = new ModalBuilder()
        .setTitle("Ticket")
        .setCustomId(`mcplugin_t_create-${projectID}`)

    const serverSoftwareInput = new TextInputBuilder()
        .setCustomId("serversoftware")
        .setLabel("What Server Software do you use?")
        .setPlaceholder("PapaerMC, Spigot, Bukkit etc.")
        .setRequired(true)
        .setMinLength(3)
        .setMaxLength(50)
        .setStyle(TextInputStyle.Short)

    const serverVersionInput = new TextInputBuilder()
        .setCustomId("serverversion")
        .setLabel("What MC Version is your Server running on?")
        .setPlaceholder("1.8.8, 1.16.5, 1.20.1 etc.")
        .setRequired(true)
        .setMinLength(3)
        .setMaxLength(50)
        .setStyle(TextInputStyle.Short)

    const pluginVersionInput = new TextInputBuilder()
        .setCustomId("pluginversion")
        .setLabel("What Version of the Plugin are you using?")
        .setPlaceholder("1.0.0, 1.0.9, 1.2.2 etc.")
        .setRequired(true)
        .setMinLength(3)
        .setMaxLength(50)
        .setStyle(TextInputStyle.Short)

    const problemDescriptionInput = new TextInputBuilder()
        .setCustomId("problemdescription")
        .setLabel("Describe your problem")
        .setPlaceholder("Expected and actual behavior as well as the steps to reproduce")
        .setRequired(true)
        .setMinLength(3)
        .setMaxLength(1000)
        .setStyle(TextInputStyle.Paragraph)

    const actionrowOne = new ActionRowBuilder().addComponents(serverSoftwareInput)
    const actionrowTwo = new ActionRowBuilder().addComponents(serverVersionInput)
    const actionrowThree = new ActionRowBuilder().addComponents(pluginVersionInput)
    const actionrowFour = new ActionRowBuilder().addComponents(problemDescriptionInput)

    modal.addComponents(actionrowOne, actionrowTwo, actionrowThree, actionrowFour)

    return modal;
}

module.exports = getModal;