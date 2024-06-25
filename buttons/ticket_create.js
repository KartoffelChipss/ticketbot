const { getStandardEmbed } = require("../util/messages.js");
const ticketmodal = require('../ticketmodel.js');
const options = require("../options.json");

/**
 * Execute the command
 * @param {import('discord.js').Interaction} interaction - The interaction that triggered the command
 */
let clickButton = async function clickButton(interaction) {
    let userHastickets = await ticketmodal.find({ userId: interaction.user.id, closed: false });

    if (userHastickets.length >= 5) {
        setTimeout(() => {
            interaction.reply({
                content: `<:KMC_rotesx:995387682643509329> You cannot have more than 5 Tickets open at the same time!`,
                ephemeral: true,
            });
        }, 1000);
        return;
    }

    const projects = options.projects.map(project => {
        return {
            label: project.name,
            value: project.id,
            description: project.description,
            emoji: {
                name: project.emoji.name,
                id: project.emoji.id
            }
        }
    });

    interaction.reply({
        "content": " ",
        "ephemeral": true,
        "embeds": [ getStandardEmbed(`Please select below, what Project your Ticket is about`) ],
        "components": [
            {
                "type": 1,
                "components": [
                    {
                        "type": 3,
                        "custom_id": "project_select",
                        "options": projects,
                        "placeholder": "Choose a Project",
                        "min_values": 1,
                        "max_values": 1
                    }
                ]
            }
        ]
    }).catch(console.error)
}

module.exports = { buttonId: "ticket_create", clickButton };