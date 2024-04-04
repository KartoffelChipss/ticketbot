const { ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const { ActionRowBuilder } = require('@discordjs/builders');

function getModal(projectID) {
    const modal = new ModalBuilder()
        .setTitle("Ticket")
        .setCustomId(`other_t_create-${projectID}`)

    const problemDescriptionInput = new TextInputBuilder()
        .setCustomId("problemdescription")
        .setLabel("Describe your problem")
        .setPlaceholder("Expected and actual behavior as well as the steps to reproduce")
        .setRequired(true)
        .setMinLength(3)
        .setMaxLength(1000)
        .setStyle(TextInputStyle.Paragraph)

    const actionrowOne = new ActionRowBuilder().addComponents(problemDescriptionInput)

    modal.addComponents(actionrowOne)

    return modal;
}

module.exports = getModal;