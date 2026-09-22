const ejs = require('ejs');

const facilityService = require('../services/facilityService');
const bodyParser = require('body-parser');
const parseForm = bodyParser.urlencoded({ extended: false });
const con = require('../config/db');


const gethome = async (req, res) => {
    let Activities = await facilityService.getAllfacilities()

    ejs.renderFile('./src/views/pages/facilities.ejs', { facilities: Activities.rows }, (error, data) => {
        res.end(data)
    })
};

const showCreateForm = async (req, res) => {
    ejs.renderFile('./src/views/pages/facility-form.ejs', (error, data) => {
        res.end(data)
    })
};
const store_facility = async (req, res) => {
    const queryText = `
        INSERT INTO public.facilities (
            name, 
            address,
            erp_capacity
        ) VALUES ($1, $2, $3)
    `;

    return parseForm(req, res, () => {
        const values = [
            req.body.name,
            req.body.address || 'Adresse municipale par défaut', // لتفادي الخطأ إذا كان الحقل فارغاً
            parseInt(req.body.erp_capacity, 10)
        ];

        con.query(queryText, values, (err) => {
            if (err) {
                return res.end("err: " + err.message);
            }
            res.writeHead(302, { 'Location': '/facilities' });
            res.end();
        });
    });
};
const show_edit_Form = async (req, res, id) => {

    let test = await facilityService.getActivities_id(id)

    ejs.renderFile('./src/views/pages/facility--form-edit.ejs', { test }, (error, data) => {
        res.end(data)
    })
};
const show_update_Form = async (req, res, id) => {
    const queryText = `
        UPDATE public.facilities 
        SET 
            name = $1, 
            address = $2, 
            erp_capacity = $3
        WHERE id = $4
    `;

    return parseForm(req, res, () => {
        const values = [
            req.body.name,
            req.body.address || 'Adresse municipale par défaut',
            parseInt(req.body.erp_capacity, 10),
            id
        ];

        con.query(queryText, values, (err) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
                return res.end("err: " + err.message);
            }
            res.writeHead(302, { 'Location': '/facilities' });
            res.end();
        });
    });
};
const show_delete_Form = async (req, res, id) => {


    const queryText = `DELETE FROM public.facilities WHERE id = $1`;
    const values = [id];
    parseForm(req, res, async () => {

        await con.query(queryText, values);

        res.writeHead(302, { 'Location': '/facilities' });
        res.end()
    })

};

module.exports = {
    gethome,
    showCreateForm,
    store_facility,
    show_edit_Form,
    show_update_Form,
    show_delete_Form
};