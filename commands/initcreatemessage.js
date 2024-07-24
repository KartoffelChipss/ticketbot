let command = {
    name: "initcreatemessage",
    name_localizations: {
        "de": "initcreatemessage",
        "en-GB": "initcreatemessage",
        "en-US": "initcreatemessage",
    },
    description: "Get the ping to the bot",
    description_localizations: {
        "de": "Get the ping to the bot",
        "en-GB": "Get the ping to the bot",
        "en-US": "Get the ping to the bot",
    },
    default_member_permissions: "8",
    dm_permission: false,
    options: [
        {
            type: 7,
            name: "channel",
            description: "The channel where the ticket message should be sent",
            required: true,
            channel_types: [0, 5, 10, 11, 15]
        }
    ]
}

let executeCommand = function executeCommand(interaction, getLocale) {
    const { commandName, options } = interaction;

    let channel = options.getChannel("channel");

    if (!channel) return;

    channel.send({
        "content": " ",
        "ephemeral": false,
        "embeds": [
            {
                "type": "rich",
                "title": "Tickets",
                "description": `To open a ticket, click the button below.`,
                "color": 0x2B2D31
            }
        ],
        "components": [
            {
                "type": 1,
                "components": [
                    {
                        "style": 2,
                        "type": 2,
                        "label": "Open Ticket",
                        "custom_id": `ticket_create`,
                        "disabled": false,
                        "emoji": {
                          "id": null,
                          "name": `📩`
                        }
                    }
                ]
            }
        ]
    }).catch(console.error)

    interaction.reply({
        "content": " ",
        "ephemeral": true,
        "embeds": [
            {
                "type": "rich",
                "title": "Created message!",
                "color": 0x2B2D31,
            }
        ]
    }).catch(console.error)
}

module.exports.command = command;
module.exports.executeCommand = executeCommand;