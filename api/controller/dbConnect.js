const { Pool, Client } = require('pg');

const client = new Client({
    user: 'rdawinhwbgjlxe',
    host: 'ec2-54-247-107-109.eu-west-1.compute.amazonaws.com',
    database: 'd6i1cd6mm5moev',
    password: 'b17b6c67a2588915c573d03a245c7dd487fa7077d400b50f0ca9682807763aea',
    port: 5432,
    ssl: {rejectUnauthorized: false}
})
client.connect();

client.Promise = global.Promise;

module.exports = client;