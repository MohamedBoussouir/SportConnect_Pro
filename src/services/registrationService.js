
const con = require('../config/db');


const getAllregistration = async () => {
    const data = await con.query('SELECT * FROM public.registrations ORDER BY id ASC')
    return data
}
const getAllregistration_id = async (id) => {
    const data = await con.query(`SELECT * FROM public.registration WHERE id=$1`,[id])
    return data
}


module.exports = {
    getAllregistration,
    getAllregistration_id
};