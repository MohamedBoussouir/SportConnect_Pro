
const con = require('../config/db');


const getAllmember = async () => {
    const data = await con.query('SELECT * FROM public.members ORDER BY id ASC')
    return data
}
const getAllmember_id = async (id) => {
    const data = await con.query(`SELECT * FROM public.members WHERE id=$1`,[id])
    return data
}


module.exports = {
    getAllmember,
    getAllmember_id
};