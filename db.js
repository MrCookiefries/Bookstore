/** Database config for database. */


const { Client } = require("pg");
const {dbConfig} = require("./config");

const db = new Client(dbConfig);

db.connect();

module.exports = db;
