
const con = require('../config/db');


const getAllfacilities = async () => {
    const data = await con.query('SELECT * FROM public.facilities ORDER BY id ASC')
    return data
}
const getActivities_id = async (id) => {
    const data = await con.query(`SELECT * FROM public.facilities WHERE id=$1`,[id])
    return data.rows
}

module.exports = {
    getAllfacilities,
    getActivities_id
    
};