const ejs = require('ejs');

const activitiesService = require('../services/activitiesService');
const bodyParser = require('body-parser');
const parseForm = bodyParser.urlencoded({ extended: false });
const con = require('../config/db');

const Activities = async (req, res) => {
    let Activities = await activitiesService.getAllActivities()

    ejs.renderFile('./src/views/pages/activities.ejs', { activities: Activities.rows }, (error, data) => {
        res.end(data)

    })


};

const showCreateForm = async (req, res) => {
    const facilitiesResult = await con.query('SELECT id, name, erp_capacity FROM public.facilities ORDER BY name ASC');
    const facilities = facilitiesResult.rows;
    ejs.renderFile('./src/views/pages/activity-form.ejs', { facilities }, (error, data) => {
        res.end(data)
    })
};


const storeActivity = (req, res) => {
    const queryText = `
        INSERT INTO public.activities (
            name, 
            base_price, 
            max_capacity,
            association_id, 
            facility_id, 
            target_category, 
            day_of_week, 
            start_time, 
            end_time
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    `;

    return parseForm(req, res, () => {
        const startTime = req.body.start_time;
        const endTime = req.body.end_time;

        
        if (startTime >= endTime) {
            res.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' });
            return res.end("Erreur: L'heure de fin doit être postérieure à l'heure de début.");
        }

        const values = [
            req.body.name,
            parseFloat(req.body.base_price),
            parseInt(req.body.max_capacity, 10),
            1,
            parseInt(req.body.facility_id, 10),
            'Senior',
            req.body.day_of_week,
            startTime,
            endTime
        ];

        con.query(queryText, values, (err) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
                return res.end("Erreur lors de l'enregistrement : " + err.message);
            }
            res.writeHead(302, { 'Location': '/activities' });
            res.end();
        });
    });
};


const gethome = async (req, res) => {
    try {
        const [
            activitiesCount,
            facilitiesCount,
            membersCount,
            registrationsCount,
            recentActivities
        ] = await Promise.all([
            
            con.query('SELECT COUNT(*) AS total FROM public.activities'),
            
            con.query('SELECT COUNT(*) AS total FROM public.facilities'),
            
            con.query('SELECT COUNT(*) AS total FROM public.members'),
            
            con.query("SELECT COUNT(*) AS total FROM public.registrations WHERE status = 'confirmed'"),
            
            con.query(`
                SELECT a.*, f.name AS facility_name 
                FROM public.activities a 
                LEFT JOIN public.facilities f ON a.facility_id = f.id 
                ORDER BY a.id DESC 
                LIMIT 5
            `)
        ]);

        const stats = {
            activities: activitiesCount.rows[0].total,
            facilities: facilitiesCount.rows[0].total,
            members: membersCount.rows[0].total,
            confirmedRegistrations: registrationsCount.rows[0].total,
            recentActivities: recentActivities.rows
        };

        ejs.renderFile('./src/views/home.ejs', { stats }, (error, data) => {
            if (error) {
                res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
                return res.end("Erreur d'affichage : " + error.message);
            }
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end(data);
        });

    } catch (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end("Erreur SQL Dashboard : " + err.message);
    }
};

const show_edit_Form = async (req, res, id) => {
    let test = await activitiesService.getActivities_id(id)
    ejs.renderFile('./src/views/pages/activity-form-edit.ejs', { test }, (error, data) => {
        res.end(data)
    })
};
const update_activities = async (req, res, id) => {


    const queryText = `
  UPDATE public.activities 
  SET 
    name = $1, 
    base_price = $2, 
    max_capacity = $3,
    association_id = $4, 
    facility_id = $5, 
    target_category = $6, 
    day_of_week = $7, 
    start_time = $8, 
    end_time = $9
  WHERE id = $10
`;
    parseForm(req, res, async () => {
        const values = [
            req.body.name,
            parseFloat(req.body.base_price),
            parseInt(req.body.max_capacity, 10),
            req.body.association_id ? parseInt(req.body.association_id, 10) : 1,
            req.body.facility_id ? parseInt(req.body.facility_id, 10) : 1,
            req.body.target_category || 'Senior',
            req.body.day_of_week,
            req.body.start_time,
            req.body.end_time,
            id
        ];

        await con.query(queryText, values);

        res.writeHead(302, { 'Location': '/activities' });
        res.end()
    })

};
const delete_activities = async (req, res, id) => {


    const queryText = `DELETE FROM public.activities WHERE id = $1`;
    const values = [id];
    parseForm(req, res, async () => {

        await con.query(queryText, values);

        res.writeHead(302, { 'Location': '/activities' });
        res.end()
    })

};
module.exports = {
    gethome,
    Activities,
    showCreateForm,
    storeActivity,
    show_edit_Form,
    delete_activities,
    update_activities
};