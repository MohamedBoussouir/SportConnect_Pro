const ejs = require('ejs');

const registrationService = require('../services/registrationService');
const bodyParser = require('body-parser');
const parseForm = bodyParser.urlencoded({ extended: false });
const con = require('../config/db');

const registration = async (req, res) => {

    let registration = await registrationService.getAllregistration()
    console.log(registration.rows);


    ejs.renderFile('./src/views/pages/registrations.ejs', { registrations: registration.rows }, (error, data) => {
        res.end(data)
    })
};
const showRegistrationForm = async (req, res) => {
    try {
        const [membersRes, activitiesRes] = await Promise.all([
            con.query('SELECT id, first_name, last_name, is_resident, has_pass_sport FROM public.members ORDER BY first_name ASC'),
            con.query(`
                SELECT a.id, a.name, f.name AS facility_name 
                FROM public.activities a 
                LEFT JOIN public.facilities f ON a.facility_id = f.id 
                ORDER BY a.name ASC
            `)
        ]);

        ejs.renderFile('./src/views/pages/registrations-form.ejs', {
            members: membersRes.rows,
            activities: activitiesRes.rows
        }, (error, data) => {
            if (error) {
                res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
                return res.end("Erreur d'affichage : " + error.message);
            }
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end(data);
        });
    } catch (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end("Erreur SQL : " + err.message);
    }
};



const store_Registration = async (req, res) => {
    return parseForm(req, res, async () => {
        try {
            const { member_id, activity_id } = req.body;

            const status = (req.body.status === 'cancelled') ? 'cancelled' : 'confirmed';

            if (!member_id || !activity_id) {
                res.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' });
                return res.end("Erreur : L'adhérent et l'activité sont obligatoires.");
            }
            const memberResult = await con.query(
                'SELECT is_resident, has_pass_sport FROM public.members WHERE id = $1',
                [member_id]
            );

            if (memberResult.rows.length === 0) {
                res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
                return res.end("Adhérent non trouvé.");
            }

            const member = memberResult.rows[0];

            
            const activityResult = await con.query(
                'SELECT * FROM public.activities WHERE id = $1',
                [activity_id]
            );

            if (activityResult.rows.length === 0) {
                res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
                return res.end("Activité non trouvée.");
            }
            const activity = activityResult.rows[0];
            let basePrice = Number(activity.base_price || 150.00);

            let finalPrice = basePrice;
            if (!member.is_resident) {
                finalPrice = finalPrice * 1.35; 
            }
            if (member.has_pass_sport) {
                finalPrice = finalPrice - 50.00; 
            }
            finalPrice = Math.max(15.00, finalPrice); 
            finalPrice = Math.round(finalPrice * 100) / 100;

            
            const queryText = `
                INSERT INTO public.registrations (
                    member_id, 
                    activity_id, 
                    status,
                    final_price
                ) VALUES ($1, $2, $3, $4)
            `;

            const values = [
                parseInt(member_id, 10),
                parseInt(activity_id, 10),
                status, 
                finalPrice
            ];

            await con.query(queryText, values);

            res.writeHead(302, { 'Location': '/registrations' });
            res.end();

        } catch (err) {
            res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
            res.end("Erreur lors de l'enregistrement de l'inscription : " + err.message);
        }
    });
};


const delete_Registration = async (req, res, id) => {
    try {
        const queryText = `
            UPDATE public.registrations 
            SET status = 'cancelled' 
            WHERE id = $1
        `;
        await con.query(queryText, [id]);

        
        res.writeHead(302, { 'Location': '/registrations' });
        res.end();

    } catch (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end("Erreur lors de l'annulation de l'inscription : " + err.message);
    }
};
module.exports = {
    registration,
    showRegistrationForm,
    store_Registration,
    delete_Registration
};