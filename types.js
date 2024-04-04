/**
 * @typedef {'other' | 'mcplugin'} ProjectType
 */

/**
 * @typedef {Object} ProjectEmoji
 * @property {string} id - The ID of the emoji
 * @property {string} name - The name of the emoji
 */

/**
 * @typedef {Object} ProjectField
 * @property {string} id - The ID of the field
 * @property {string} label - The label of the field
 * @property {string} placeholder - The placeholder of the field
 * @property {boolean} required - Whether the field is required
 * @property {number} minLength - The minLength of the field
 * @property {number} maxLength - The maxLength of the field
 * @property {boolean} long - Whether the field is long
 * @property {string} name - The name, that will be shown in the ticket message
 */

/**
 * @typedef {Object} Project
 * @property {string} id - The ID of the project
 * @property {string} name - The name of the project
 * @property {string} description - The description of the project
 * @property {ProjectEmoji} emoji - The emoji of the project
 * @property {ProjectType} type - The type of the project
 * @property {ProjectField[]} fields - The fields of the project modal
 */

/**
 * @typedef {Object} TicketMessageOptions
 * @property {import("discord.js").User} creator - The user, that created the ticket
 * @property {import("discord.js").TextChannel} channel - The ticket channel
 * @property {Project} project - The project of the ticket
 */

/**
 * @typedef {Object} TicketMessageFields
 * @property {string} label - The label of the field
 * @property {string} value - The value of the field
 */

exports.unused = {};