
const con = require('../config/db');


const getAllActivities = async () => {
    const data = await con.query('SELECT * FROM public.activities ORDER BY id ASC')
    return data
}
const getAllActivitie = async () => {
    const data = await con.query(`SELECT 
    a.name AS activity,
    a.max_capacity AS capacity,
    COUNT(r.id) AS registered,
    ROUND((COUNT(r.id) * 100.0) / a.max_capacity) AS "fillRate"
FROM activities a
LEFT JOIN registrations r 
    ON a.id = r.activity_id AND r.status = 'confirmed'
GROUP BY a.id, a.name, a.max_capacity;`)
    return data.rows
}

const getActivities_id = async (id) => {
    const data = await con.query(`SELECT * FROM public.activities WHERE id=$1`, [id])
    return data.rows
}

module.exports = {
    getAllActivities,
    getActivities_id,
    getAllActivitie
};


`SELECT 
    a.name AS activity,
    a.capacity AS capacity,
    COUNT(i.id) FILTER (WHERE i.status = 'confirmed') AS registered,
    ROUND(
        (COUNT(i.id) FILTER (WHERE i.status = 'confirmed')::DECIMAL / NULLIF(a.capacity, 0)) * 100, 
        2
    ) AS "fillRate"
FROM activities a
LEFT JOIN inscriptions i ON a.id = i.activity_id
GROUP BY a.id, a.name, a.capacity;"`