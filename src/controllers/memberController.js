const ejs = require('ejs');

const memberService = require('../services/memberService');
const bodyParser = require('body-parser');
const parseForm = bodyParser.urlencoded({ extended: false });
const con = require('../config/db');


const member = async (req, res) => {

    let member = await memberService.getAllmember()


    ejs.renderFile('./src/views/pages/members.ejs', { members: member.rows }, (error, data) => {
        res.end(data)
    })
};
const member_Form = async (req, res) => {

    ejs.renderFile('./src/views/pages/member-form.ejs', { members: member.rows }, (error, data) => {
        res.end(data)
    })
};
const store_member = async (req, res) => {
    return parseForm(req, res, async () => {
        try {
            const birthDate = req.body.birth_date;
            const medicalCertDate = req.body.medical_cert_date;

            const queryText = `
                INSERT INTO public.members (
                    first_name, 
                    last_name, 
                    birth_date, 
                    medical_cert_date, 
                    is_resident, 
                    has_pass_sport
                ) VALUES ($1, $2, $3, $4, $5, $6)
            `;

            const values = [
                req.body.first_name,
                req.body.last_name,
                birthDate,
                medicalCertDate,
                req.body.is_resident === 'true',
                req.body.has_pass_sport === 'true'
            ];

            await con.query(queryText, values);

            res.writeHead(302, { 'Location': '/members' });
            res.end();

        } catch (err) {
            res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
            res.end("Erreur SQL : " + err.message);
        }
    });
};
const show_Form = async (req, res, id) => {
    let member = await memberService.getAllmember_id(id)
    console.log(member.rows);

    ejs.renderFile('./src/views/pages/member-form-edit.ejs', { member: member.rows[0] }, (error, data) => {
        res.end(data)
    })
};
const update_Form = async (req, res, id) => {
    return parseForm(req, res, async () => {
        try {
            const birthDate = req.body.birth_date;
            const medicalCertDate = req.body.medical_cert_date;


            if (!birthDate || !medicalCertDate) {
                res.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' });
                return res.end("Erreur : La date de naissance et la date du certificat médical sont obligatoires.");
            }

            const queryText = `
                UPDATE public.members 
                SET 
                    first_name = $1,
                    last_name = $2,
                    birth_date = $3,
                    medical_cert_date = $4,
                    is_resident = $5,
                    has_pass_sport = $6
                WHERE id = $7
            `;

            const values = [
                req.body.first_name,
                req.body.last_name,
                birthDate,
                medicalCertDate,
                req.body.is_resident === 'true',
                req.body.has_pass_sport === 'true',
                id
            ];

            await con.query(queryText, values);


            res.writeHead(302, { 'Location': '/members' });
            res.end();

        } catch (err) {
            res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
            res.end("Erreur lors de la mise à jour de l'adhérent : " + err.message);
        }
    });
};
const delete_Form = async (req, res, id) => {
    try {
        const queryText = `DELETE FROM public.members WHERE id = $1`;
        await con.query(queryText, [id]);

        res.writeHead(302, { 'Location': '/members' });
        res.end();

    } catch (err) {
        
        if (err.code === '23503') {
            res.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' });
            return res.end("Impossible de supprimer cet adhérent car il possède des inscriptions actives.");
        }

        res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end("Erreur lors de la suppression de l'adhérent : " + err.message);
    }
};



module.exports = {
    member,
    member_Form,
    store_member,
    show_Form,
    update_Form,
    delete_Form
};