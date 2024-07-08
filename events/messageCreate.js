const ticketmodel = require("../ticketmodel");

module.exports = {
    name: 'messageCreate',
    /**
     * Execute the command
     * @param {import('discord.js').Message} message - The message
     */
    async execute(message) {
        const channelID = message.channel.id;

        const ticketModal = await ticketmodel.findOne({ ticketid: channelID });

        if (ticketModal && (message.content || message.attachments) && !message.author.bot && false) {
            ticketModal.messageLog.push({
                userId: message.member.user.id,
                userName: message.member.user.globalName,
                avatar: message.member.user.displayAvatarURL(),
                content: message.content,
                attachements: message.attachments,
                timestamp: new Date().getTime(),
            });
            ticketModal.save();
            console.log(`${message.member.user.username}: ${message.content}`);
        }
    }
}