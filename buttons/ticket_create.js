const { getStandardEmbed, getTicketMessage } = require("../util/messages.js");
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

    const filter = (i) => i.customId === 'project_select' && i.user.id === interaction.user.id;

    const projectCollector = interaction.channel.createMessageComponentCollector({
        filter,
        time: 30000,
        max: 1
    });

    let choseProject = false;

    projectCollector.on('end', async (collected) => {
        if (!choseProject) {
            interaction.editReply({
                content: `<:KMC_rotesx:995387682643509329> You took too long to select a Project!`,
                ephemeral: true,
            });
        }
    });

    projectCollector.on('collect', async (project_interaction) => {
        project_interaction.deferUpdate();
        const project = options.projects.find(project => project.id === project_interaction.values[0]);

        if (project) choseProject = true;
        else {
            interaction.editReply({
                content: `<:KMC_rotesx:995387682643509329> This Project does not exist!`,
                ephemeral: true,
                embed: [],
                components: [],
            });
            return;
        }
    
        interaction.editReply({
            "content": " ",
            "ephemeral": true,
            "embeds": [ getStandardEmbed(`Should this ticket be **publicly visible** or **private**?`) ],
            "components": [
                {
                    "type": 1,
                    "components": [
                        {
                            "type": 3,
                            "custom_id": "visibility_select",
                            "options": [
                                {
                                    "label": "Public",
                                    "value": "public",
                                    "description": "Everyone can see this ticket",
                                },
                                {
                                    "label": "Private",
                                    "value": "private",
                                    "description": "Only you and the staff can see this ticket",
                                }
                            ],
                            "placeholder": "Choose Visibility",
                            "min_values": 1,
                            "max_values": 1
                        }
                    ]
                }
            ]
        }).catch(console.error);

        const filter = (i) => i.customId === 'visibility_select' && i.user.id === interaction.user.id;

        const vsibilityCollector = project_interaction.channel.createMessageComponentCollector({
            filter,
            time: 30000,
            max: 1
        });

        let choseVisibility = false;

        vsibilityCollector.on('end', async (collected) => {
            if (!choseVisibility) {
                interaction.editReply({
                    content: `<:KMC_rotesx:995387682643509329> You took too long to select a Visibility!`,
                    ephemeral: true,
                    embed: [],
                    components: [],
                });
            }
        });

        vsibilityCollector.on('collect', async (visibility_interaction) => {
            const visibility = visibility_interaction.values[0];

            choseVisibility = true;

            const getModal = require("../util/modals.js");
            const modal = getModal(project);
            await visibility_interaction.showModal(modal);

            interaction.editReply({
                content: " ",
                ephemeral: true,
                embeds: [ getStandardEmbed(`Waiting for Modal input...`)],
                components: []
            });

            const modalFilter = (i) => i.customId === 't_create' && i.user.id === interaction.user.id;
            const modalCollector = visibility_interaction.channel.createMessageComponentCollector({
                filter: modalFilter,
                time: 60000,
                max: 1
            });

            let filledModal = false;

            modalCollector.on('collect', async (modal_interaction) => {
                modal_interaction.deferUpdate();
                filledModal = true;

                interaction.editReply({
                    content: "<a:KMC_loading:1005352031457906788> Creating Ticket...",
                    ephemeral: true,
                    embeds: [],
                    components: [],
                });

                const fields = project.fields.map(field => {
                    return {
                        label: field.name,
                        value: modal_interaction.fields.getTextInputValue(field.id)
                    }
                })

                modal_interaction.guild.channels.create({
                    name: `${modal_interaction.user.globalName}-${project.id}`,
                    type: 0,
                })
                    .catch((err) => {
                        console.error(err);
                        setTimeout(() => {
                            interaction.editReply({
                                content: `<:KMC_rotesx:995387682643509329> There was an error whilst creating your Ticket!`,
                                ephemeral: true,
                                embeds: [],
                                components: [],
                            });
                        }, 1000);
                    })
                    .then(async (channel) => {
                        if (!channel) {
                            setTimeout(() => {
                                interaction.editReply({
                                    content: `<:KMC_rotesx:995387682643509329> There was an error whilst creating your Ticket!`,
                                    ephemeral: true,
                                    embeds: [],
                                    components: [],
                                });
                            }, 1000);
                            return;
                        }

                        channel.setParent(options.ticketCategory).catch(console.error)

                        await ticketmodal.create({ userId: modal_interaction.user.id, ticketid: channel.id, project: project.id });

                        setTimeout(async () => {
                            interaction.editReply({
                                content: `<:KMC_BlauerHaken:987665905041424474> Your ticket has been created: <#${channel.id}>`,
                                ephemeral: true,
                                embeds: [],
                                components: [],
                            }).catch(console.error)

                            channel.permissionOverwrites.create(modal_interaction.member, {
                                ViewChannel: true,
                                SendMessages: true,
                                ReadMessageHistory: true
                            }).catch(console.error)

                            await channel.permissionOverwrites.create(modal_interaction.guild.roles.everyone, {
                                ViewChannel: false,
                                SendMessages: false,
                                ReadMessageHistory: false
                            }).catch(console.error)

                            channel.permissionOverwrites.create(options.ticketManagerRole, {
                                ViewChannel: true,
                                SendMessages: true,
                                ReadMessageHistory: true
                            }).catch(console.error)

                            channel.send(
                                getTicketMessage({
                                    channel,
                                    creator: modal_interaction.user,
                                    project,
                                }, fields)
                            ).catch(console.error)

                        }, 1000)
                    });
            });

            modalCollector.on('end', async (collected) => {
                if (!filledModal) {
                    interaction.editReply({
                        content: `<:KMC_rotesx:995387682643509329> You took too long to input the Modal!`,
                        ephemeral: true,
                        embeds: [],
                        components: [],
                    });
                }
            });
        });
    });
}

module.exports = { buttonId: "ticket_create", clickButton };