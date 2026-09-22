
const con = require('../config/db');


const getAllActivities = async () => {
    const data = await con.query('SELECT * FROM public.activities ORDER BY id ASC')
    return data
}
const getActivities_id = async (id) => {
    const data = await con.query(`SELECT * FROM public.activities WHERE id=$1`,[id])
    return data.rows
}

module.exports = {
    getAllActivities,
    getActivities_id
};