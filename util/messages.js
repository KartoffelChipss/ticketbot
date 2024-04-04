const { EmbedBuilder } = require("discord.js")
const botOptions = require("../options.json");

/**
 * @param {String} message 
 * @returns {import("discord.js").EmbedBuilder}
 */
function getStandardEmbed(message) {
    const embed = new EmbedBuilder()
        .setColor(0x2B2D31)
        .setTitle(" ")
        .setDescription(message)

    return embed;
}

/**
 * @param {import("../types").TicketMessageOptions} options - The options for the ticket message
 * @param {import("../types").TicketMessageFields[]} fields - The fields for the ticket message
 * @returns {Object}
 */
function getTicketMessage(options, fields) {
    let messageDescription = `
    **Project:**
    > <:${options.project.emoji.name}:${options.project.emoji.id}> ${options.project.name}`;

    for (const field of fields) {
        messageDescription += `
        \n**${field.label}:**
        > ${field.value}`;
    }

    messageDescription += `\n\nIf you have screenshots, videos, or log files, please don't hesitate to share them as they can be highly beneficial.\n\nYou can close this ticket with 🔒.`;

    const message = {
        content: `<@${options.creator.id}>||<@&${botOptions.ticketManagerRole}>||`,
        components: [
            {
                type: 1,
                components: [
                    {
                        type: 2,
                        style: 2,
                        label: "Close Ticket",
                        custom_id: `tclose_${options.channel.id}`,
                        disabled: false,
                        emoji: {
                            id: null,
                            name: `🔒`
                        }
                    }
                ]
            }
        ],
        embeds: [
            {
                type: "rich",
                title: `${options.creator.globalName}'s Ticket`,
                description: messageDescription,
                color: 0x2B2D31,
                footer: {
                    text: `Bot by Kartoffelchipss`,
                    icon_url: "https://strassburger.org/img/pp.png"
                },
            }
        ]
    }

    return message;
}

module.exports = {
    getStandardEmbed,
    getTicketMessage,
}