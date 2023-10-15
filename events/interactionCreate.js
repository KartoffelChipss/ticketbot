const path = require('node:path');
const fs = require("fs");
const options = require("../options.json");
const mongoose = require("mongoose");
const ticketmodal = require('../ticketmodal.js');

module.exports = {
    name: 'interactionCreate',
    async execute(interaction) {

        if (interaction.isCommand()) {
            const { commandName, options } = interaction;
            const commandDir = path.resolve(`${process.cwd()}${path.sep}commands`);

            if (fs.existsSync(`${commandDir}${path.sep}${commandName}.js`)) {

                let commandFile = require(`${commandDir}${path.sep}${commandName}.js`);

                commandFile.executeCommand(interaction);

                return;
            }
        }

        if (interaction.isButton()) {
            if (interaction.customId === "ticket_create") {
                interaction.reply({
                    "content": " ",
                    "ephemeral": true,
                    "embeds": [
                        {
                            "type": "rich",
                            "title": "",
                            "description": `Please select below, what Project your Ticket is about`,
                            "color": 0x2B2D31
                        }
                    ],
                    "components": [
                        {
                            "type": 1,
                            "components": [
                                {
                                    "type": 3,
                                    "custom_id": "project_select",
                                    "options": [
                                        {
                                            "label": "Argus",
                                            "value": "argus",
                                            "description": "",
                                            "emoji": {
                                                "name": "argus",
                                                "id": "1145039798369800232"
                                            }
                                        },
                                        {
                                            "label": "LifeStealZ",
                                            "value": "lifestealz",
                                            "description": "",
                                            "emoji": {
                                                "name": "lifestealz",
                                                "id": "1163131461231198328"
                                            }
                                        },
                                        {
                                            "label": "Other",
                                            "value": "other",
                                            "description": "",
                                            "emoji": {
                                                "name": "dots",
                                                "id": "1163132845825470547"
                                            }
                                        }
                                    ],
                                    "placeholder": "Choose a Project",
                                    "min_values": 1,
                                    "max_values": 1
                                }
                            ]
                        }
                    ]
                }).catch(console.error)
            }

            if (interaction.customId.split("_")[0] === "tclose") {
                let channelID = interaction.customId.split("_")[1];
                let ticketDoc = await ticketmodal.findOne({ ticketid: channelID });
                
                if (!ticketDoc) {
                    interaction.reply({
                        content: `<:KMC_rotesx:995387682643509329> This Ticket does not exist!`,
                        ephemeral: true,
                    })
                    return;
                }

                let channel = await interaction.client.channels.fetch(channelID);

                if (!channel) {
                    interaction.reply({
                        content: `<:KMC_rotesx:995387682643509329> This Ticket does not exist!`,
                        ephemeral: true,
                    })
                    return;
                }

                if (ticketDoc.closed === true) {
                    if (ticketDoc.archived === true) {
                        interaction.reply({
                            content: "<:KMC_rotesx:995387682643509329> You cannot unlock an archived Ticket",
                            ephemeral: true,
                        }).catch(console.error)
                        return;
                    }

                    await ticketmodal.findOneAndUpdate({ ticketid: ticketDoc.ticketid }, { closed: false }, { returnOriginal: false });

                    await channel.permissionOverwrites.create(ticketDoc.userId, {
                        ViewChannel: true,
                        SendMessages: true,
                        ReadMessageHistory: true
                    }).catch(console.error)

                    interaction.deferUpdate();

                    channel.send({
                        "content": ``,
                        "ephemeral": false,
                        "embeds": [
                            {
                                "type": "rich",
                                "title": ``,
                                "description": `🔓 **This Ticket has been unlocked**`,
                                "color": 0x2B2D31,
                                //"color": 0x4673FF,
                                // "footer": {
                                //     "text": `Bot by Kartoffelchips#0445`,
                                //     "icon_url": `https://strassburger.org/img/pp.png`
                                // }
                            }
                        ]
                    });
                } else {
                    await ticketmodal.findOneAndUpdate({ ticketid: ticketDoc.ticketid }, { closed: true }, { returnOriginal: false });

                    await channel.permissionOverwrites.create(ticketDoc.userId, {
                        ViewChannel: true,
                        SendMessages: false,
                        ReadMessageHistory: true
                    }).catch(console.error)

                    interaction.deferUpdate();

                    channel.send({
                        "content": ``,
                        "ephemeral": false,
                        "embeds": [
                            {
                                "type": "rich",
                                "title": ``,
                                "description": `🔒 **This Ticket has been closed**`,
                                "color": 0x2B2D31,
                                //"color": 0x4673FF,
                                // "footer": {
                                //     "text": `Bot by Kartoffelchips#0445`,
                                //     "icon_url": `https://strassburger.org/img/pp.png`
                                // }
                            }
                        ]
                    });
                }
            }
            
            if (interaction.customId.split("_")[0] === "tdel") {
                let channelID = interaction.customId.split("_")[1];
                let ticketDoc = await ticketmodal.findOne({ ticketid: channelID });
                
                if (!ticketDoc) {
                    interaction.reply({
                        content: `<:KMC_rotesx:995387682643509329> This Ticket does not exist!`,
                        ephemeral: true,
                    })
                    return;
                }

                let channel = await interaction.client.channels.fetch(channelID);

                if (!channel) {
                    interaction.reply({
                        content: `<:KMC_rotesx:995387682643509329> This Ticket does not exist!`,
                        ephemeral: true,
                    })
                    return;
                }

                if (!interaction.member.roles.cache.find(r => r.id === options.ticketManagerRole)) {
                    interaction.reply({
                        content: "<:KMC_rotesx:995387682643509329> You don't have permission to do that!",
                        ephemeral: true,
                    }).catch(console.error)
                    return
                }

                if (ticketDoc.closed === false) {
                    interaction.reply({
                        content: `<:KMC_rotesx:995387682643509329> You cannot delete a Ticket, that is still open!`,
                        ephemeral: true,
                    })
                    return;
                }

                await ticketmodal.findOneAndDelete({ ticketid: ticketDoc.ticketid });

                channel.delete();
            }
        }

        if (interaction.isStringSelectMenu()) {
            if (interaction.customId === "project_select") {
                let project = interaction.values[0];

                //await interaction.message.delete().catch(console.error);

                interaction.reply({
                    content: "<a:KMC_loading:1005352031457906788> Creating Ticket...",
                    ephemeral: true,
                });

                let userHastickets = await ticketmodal.find({ userId: interaction.user.id });

                if (userHastickets.length >= 5) {
                    setTimeout(() => {
                        interaction.editReply({
                            content: `<:KMC_rotesx:995387682643509329> You cannot have more than 5 Tickets open at the same time!`,
                            ephemeral: true,
                        });
                    }, 1000);
                    return;
                }

                interaction.guild.channels.create({
                    name: `${interaction.user.globalName}-${project}`,
                    type: 0,
                })
                    .catch(console.error)
                    .then(async (channel) => {

                        if (!channel) {
                            setTimeout(() => {
                                interaction.editReply({
                                    content: `<:KMC_rotesx:995387682643509329> There was an error whilst creating your Ticket!`,
                                    ephemeral: true,
                                });
                            }, 1000);
                            return;
                        }

                        channel.setParent(options.ticketCategory).catch(console.error)

                        let newTicket = await ticketmodal.create({ userId: interaction.user.id, ticketid: channel.id, project: project });

                        setTimeout(async () => {
                            interaction.editReply({
                                content: `<:KMC_BlauerHaken:987665905041424474> Dein Ticket wurde erfolgreich erstellt: <#${channel.id}>`,
                                ephemeral: true,
                            }).catch(console.error)

                            channel.permissionOverwrites.create(interaction.member, {
                                ViewChannel: true,
                                SendMessages: true,
                                ReadMessageHistory: true
                            }).catch(console.error)

                            await channel.permissionOverwrites.create(interaction.guild.roles.everyone, {
                                ViewChannel: false,
                                SendMessages: false,
                                ReadMessageHistory: false
                            }).catch(console.error)

                            channel.permissionOverwrites.create(options.ticketManagerRole, {
                                ViewChannel: true,
                                SendMessages: true,
                                ReadMessageHistory: true
                            }).catch(console.error)

                            channel.send({
                                "content": `<@${interaction.user.id}>||<@&${options.ticketManagerRole}>||`,
                                "tts": false,
                                "components": [
                                    {
                                        "type": 1,
                                        "components": [
                                            {
                                                "style": 2,
                                                "label": "Close Ticket",
                                                "custom_id": `tclose_${channel.id}`,
                                                "disabled": false,
                                                "emoji": {
                                                    "id": null,
                                                    "name": `🔒`
                                                },
                                                "type": 2
                                            },
                                            // {
                                            //     "style": 2,
                                            //     "label": "Archive Ticket",
                                            //     "custom_id": `tarchive_${channel.id}`,
                                            //     "disabled": false,
                                            //     "emoji": {
                                            //         "id": null,
                                            //         "name": `📁`
                                            //     },
                                            //     "type": 2
                                            // }
                                        ]
                                    }
                                ],
                                "embeds": [
                                    {
                                        "type": "rich",
                                        "title": `${interaction.user.globalName}'s Ticket`,
                                        "description": `**Project**: \n> ${project}\n\n**User ID**: \n> ${interaction.user.id}\n\nDescribe your request and a supporter will be with you shortly!\n\nYou can close this ticket with 🔒.`,
                                        "color": 0x2B2D31,
                                        //"color": 0x4673FF,
                                        "footer": {
                                            "text": `Bot by Kartoffelchips#0445`,
                                            "icon_url": `https://strassburger.org/img/pp.png`
                                        }
                                    }
                                ]
                            }).catch(console.error)
                        }, 1000)
                    });
            }
        }

    }
}