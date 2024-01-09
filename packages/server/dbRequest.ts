const knex = require("knex");
const knexConfig = require("../../knexfile.cjs");

module.exports = knex(knexConfig.development);
