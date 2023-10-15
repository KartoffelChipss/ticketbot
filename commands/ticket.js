const botoptions = require("../options.json");
const mongoose = require("mongoose");
const ticketmodal = require('../ticketmodal.js');

let command = {
    name: "ticket",
    name_localizations: {
        "de": "ticket",
        "en-GB": "ticket",
        "en-US": "ticket",
    },
    description: "Create a ticket",
    description_localizations: {
        "de": "Erstelle ein Ticket",
        "en-GB": "Create a ticket",
        "en-US": "Create a ticket",
    },
    dm_permission: false,
    options: [
        {
            type: 1,
            name: "close",
            description: "Close a Ticket",
        },
        {
            type: 1,
            name: "archive",
            description: "Archive a Ticket",
        },
        {
            type: 1,
            name: "delete",
            description: "Delete a Ticket",
        }
    ]
}

let executeCommand = async function executeCommand(interaction, getLocale) {
    const { commandName, options } = interaction;

    let ticketDoc = await ticketmodal.findOne({ ticketid: interaction.channel.id });

    if (!ticketDoc) {
        interaction.reply({
            content: `<:KMC_rotesx:995387682643509329> This command only works in a Ticket channel!`,
            ephemeral: true,
        })
        return;
    }

    let channel = interaction.channel

    if (!channel) {
        interaction.reply({
            content: `<:KMC_rotesx:995387682643509329> This Ticket does not exist!`,
            ephemeral: true,
        })
        return;
    }

    if (interaction.options.getSubcommand() === "close") {
        if (ticketDoc.archived === true) {
            interaction.reply({
                content: "<:KMC_rotesx:995387682643509329> You cannot unlock an archived Ticket",
                ephemeral: true,
            }).catch(console.error)
            return;
        }
        if (ticketDoc.closed === true) {
            interaction.reply({
                content: "<a:KMC_loading:1005352031457906788> Unlocking Ticket...",
                ephemeral: true,
            }).catch(console.error)

            await ticketmodal.findOneAndUpdate({ ticketid: ticketDoc.ticketid }, { closed: false }, { returnOriginal: false });

            await channel.permissionOverwrites.create(ticketDoc.userId, {
                ViewChannel: true,
                SendMessages: true,
                ReadMessageHistory: true
            }).catch(console.error)

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

            setTimeout(() => {
                interaction.deleteReply().catch(console.error)
            }, 100)
        } else {
            interaction.reply({
                content: "<a:KMC_loading:1005352031457906788> Closing Ticket...",
                ephemeral: true,
            }).catch(console.error)

            await ticketmodal.findOneAndUpdate({ ticketid: ticketDoc.ticketid }, { closed: true }, { returnOriginal: false });

            await channel.permissionOverwrites.create(ticketDoc.userId, {
                ViewChannel: true,
                SendMessages: false,
                ReadMessageHistory: true
            }).catch(console.error)

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

            setTimeout(() => {
                interaction.deleteReply().catch(console.error)
            }, 100)
        }
    }

    if (interaction.options.getSubcommand() === "archive") {
        if (!interaction.member.roles.cache.find(r => r.id === botoptions.ticketManagerRole)) {
            interaction.reply({
                content: "<:KMC_rotesx:995387682643509329> You don't have permission to do that!",
                ephemeral: true,
            }).catch(console.error)
            return
        }

        if (ticketDoc.closed === false) {
            interaction.reply({
                content: "<:KMC_rotesx:995387682643509329> A Ticket must be closed to archive it",
                ephemeral: true,
            }).catch(console.error)
            return;
        }

        if (ticketDoc.archived === true) {
            interaction.reply({
                content: "<a:KMC_loading:1005352031457906788> Restoring Ticket...",
                ephemeral: true,
            }).catch(console.error)

            await ticketmodal.findOneAndUpdate({ ticketid: ticketDoc.ticketid }, { archived: false }, { returnOriginal: false });

            await channel.setParent(botoptions.ticketCategory).catch(console.error)

            channel.permissionOverwrites.create(ticketDoc.userId, {
                ViewChannel: true,
                SendMessages: false,
                ReadMessageHistory: true
            }).catch(console.error)

            await channel.permissionOverwrites.create(interaction.guild.roles.everyone, {
                ViewChannel: false,
                SendMessages: false,
                ReadMessageHistory: false
            }).catch(console.error)

            channel.permissionOverwrites.create(botoptions.ticketManagerRole, {
                ViewChannel: true,
                SendMessages: true,
                ReadMessageHistory: true
            }).catch(console.error)

            channel.send({
                "content": ``,
                "ephemeral": false,
                "embeds": [
                    {
                        "type": "rich",
                        "title": ``,
                        "description": `📂 **This Ticket has been restored**`,
                        "color": 0x2B2D31,
                    }
                ]
            });

            setTimeout(() => {
                interaction.deleteReply().catch(console.error)
            }, 100)
        } else {
            interaction.reply({
                content: "<a:KMC_loading:1005352031457906788> Archiving Ticket...",
                ephemeral: true,
            }).catch(console.error)

            await ticketmodal.findOneAndUpdate({ ticketid: ticketDoc.ticketid }, { archived: true }, { returnOriginal: false });

            await channel.setParent(botoptions.archiveId).catch(console.error)

            channel.permissionOverwrites.create(ticketDoc.userId, {
                ViewChannel: true,
                SendMessages: false,
                ReadMessageHistory: true
            }).catch(console.error)

            await channel.permissionOverwrites.create(interaction.guild.roles.everyone, {
                ViewChannel: false,
                SendMessages: false,
                ReadMessageHistory: false
            }).catch(console.error)

            channel.permissionOverwrites.create(botoptions.ticketManagerRole, {
                ViewChannel: true,
                SendMessages: true,
                ReadMessageHistory: true
            }).catch(console.error)

            channel.send({
                "content": ``,
                "ephemeral": false,
                "embeds": [
                    {
                        "type": "rich",
                        "title": ``,
                        "description": `📁 **This Ticket has been archived**`,
                        "color": 0x2B2D31,
                    }
                ]
            });

            setTimeout(() => {
                interaction.deleteReply().catch(console.error)
            }, 100)
        }
    }

    if (interaction.options.getSubcommand() === "delete") {
        if (!interaction.member.roles.cache.find(r => r.id === botoptions.ticketManagerRole)) {
            interaction.reply({
                content: "<:KMC_rotesx:995387682643509329> You don't have permission to do that!",
                ephemeral: true,
            }).catch(console.error)
            return
        }

        if (ticketDoc.closed === false) {
            interaction.reply({
                content: "<:KMC_rotesx:995387682643509329> A Ticket must be closed to delete it",
                ephemeral: true,
            }).catch(console.error)
            return;
        }

        interaction.reply({
            "content": ``,
            "ephemeral": false,
            "embeds": [
                {
                    "type": "rich",
                    "title": ``,
                    "description": `❗ Are you sure you want to delete this ticket?`,
                    "color": 0x2B2D31,
                }
            ],
            "components": [
                {
                    "type": 1,
                    "components": [
                        {
                            "style": 4,
                            "label": "Delete Ticket",
                            "custom_id": `tdel_${channel.id}`,
                            "disabled": false,
                            "type": 2
                        },
                        {
                            "style": 2,
                            "label": "Cancel",
                            "custom_id": `cancel`,
                            "disabled": false,
                            "type": 2
                        },
                    ]
                }
            ]
        });
    }
}

module.exports.command = command;
module.exports.executeCommand = executeCommand;