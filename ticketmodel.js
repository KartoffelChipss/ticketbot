const mongoose = require('mongoose');

module.exports = mongoose.model(
    'tickets',
    new mongoose.Schema({
        userId: String,
        ticketid: String,
        project: String,
        closed: {
            type: Boolean,
            default: false
        },
        archived: {
            type: Boolean,
            default: false
        },
        messageLog: {
            type: Array,
            default: [],
        }
    })
);