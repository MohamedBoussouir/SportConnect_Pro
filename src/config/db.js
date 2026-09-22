const { Client } = require('pg')

const con = new Client({
    host: "localhost",
    user: "postgres",
    port: 5432,
    password: "postgres",
    database: "sportconnect_pro",
})
con.connect().then(() => console.log("connect"))
module.exports = con;