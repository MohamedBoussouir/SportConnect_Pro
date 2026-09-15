const { Client } = require('pg')

const con = new Client({
    host: "localhost",
    user: "postgres",
    port: 5432,
    password: "postgres",
    database: "sportconnect_pro",
})
con.connect().then(() => console.log("connect"))
con.query('SELECT * FROM public.activities WHERE id = 1', (err, res) => {
    if (!err) {
        console.log(res.rows);

    } else {
        console.log(err.message);
    }

});