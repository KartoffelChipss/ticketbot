const { TextInputStyle, TextInputBuilder, ActionRowBuilder, ModalBuilder } = require("discord.js");
const options = require("../options.json");

/**
 * My function description.
 * @param {string|import("../types").Project} project - Either a project ID as a string or the project object itself.
 */
function getModal(project) {
    if (typeof project === "string") project = options.projects.find(p => p.id === project);

    const modal = new ModalBuilder()
        .setTitle("Ticket")
        .setCustomId(`t_create-${project.id}`)

    for (const field of project.fields) {
        const input = new TextInputBuilder()
            .setCustomId(field.id)
            .setLabel(field.label)
            .setPlaceholder(field.placeholder)
            .setRequired(field.required)
            .setMinLength(field.minLength)
            .setMaxLength(field.maxLength)
            .setStyle(field.long ? TextInputStyle.Paragraph : TextInputStyle.Short)

        const actionRow = new ActionRowBuilder().addComponents(input)

        modal.addComponents(actionRow)
    }

    return modal;
}

module.exports = getModal;