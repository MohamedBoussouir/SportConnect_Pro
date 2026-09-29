

const activityController = require('../controllers/activityController');
const facilityController = require('../controllers/facilityController');
const memberController = require('../controllers/memberController');
const registrationController = require('../controllers/registrationController');
const ejs = require('ejs');



module.exports = handleRoutes;


async function handleRoutes(req, res) {
    // Help
    const parts = req.url.split('/');
    // ----------------------------------------GET /home
    if (req.url == "/" && req.method == "GET") {
        activityController.gethome(req, res)
    }
    // ---------------------------------------GET /activities
    if (req.url == "/activities" && req.method == "GET") {
        activityController.Activities(req, res)
    }
    // ----------------------------------------POST /activities
    if (req.url == "/activities" && req.method == "POST") {
        activityController.storeActivity(req, res);
        console.log(req)
    }
    // ---------------------------------------GET /activities/new
    if (req.url == "/activities/new" && req.method == "GET") {
        activityController.showCreateForm(req, res);
    }
    // ---------------------------------------GET /activities/؟/edit
    if (parts[1] === 'activities' && parts[3] === 'edit' && req.method === 'GET') {
        activityController.show_edit_Form(req, res, parts[2])
    }
    // -------------------------------------GET /activities/؟/update
    if (parts[1] === 'activities' && parts[3] === 'update' && req.method === 'POST') {
        activityController.update_activities(req, res, parts[2])
    }
    if (parts[1] === 'activities' && parts[3] === 'delete' && req.method === 'POST') {
        activityController.delete_activities(req, res, parts[2])
    }
    // ------------------------------------GET / facilities

    if (req.url == "/facilities" && req.method == "GET") {
        facilityController.gethome(req, res);
    }
    // ------------------------------------GET / facilities
    if (req.url == "/facilities/new" && req.method == "GET") {
        facilityController.showCreateForm(req, res);
    }
    // ------------------------------------POST / facilities
    if (req.url == "/facilities" && req.method == "POST") {
        facilityController.store_facility(req, res);
    }
    // ---------------------------------------GET /facilities/؟/edit
    if (parts[1] === 'facilities' && parts[3] === 'edit' && req.method === 'GET') {

        facilityController.show_edit_Form(req, res, parts[2])
    }
    // ---------------------------------------GET /facilities/؟/update 
    if (parts[1] === 'facilities' && parts[3] === 'update' && req.method === 'POST') {

        facilityController.show_update_Form(req, res, parts[2])
    }
    // ---------------------------------------GET /facilities/؟/delete 
    if (parts[1] === 'facilities' && parts[3] === 'delete' && req.method === 'POST') {

        facilityController.show_delete_Form(req, res, parts[2])
    }
    // ------------------------------------GET / members
    if (req.url == "/members" && req.method == "GET") {


        memberController.member(req, res);
    }
    // ------------------------------------POST / members/new
    if (req.url == "/members/new" && req.method == "GET") {


        memberController.member_Form(req, res);
    }
    // ------------------------------------POST / members
    if (req.url == "/members" && req.method == "POST") {


        memberController.store_member(req, res);
    }
    // ---------------------------------------GET /members/?/edit 
    if (parts[1] === 'members' && parts[3] === 'edit' && req.method === 'GET') {

        memberController.show_Form(req, res, parts[2])
    }
    // ---------------------------------------POST /members/?/update 
    if (parts[1] === 'members' && parts[3] === 'update' && req.method === 'POST') {


        memberController.update_Form(req, res, parts[2])
    }
    // ---------------------------------------POST /members/?/delete 
    if (parts[1] === 'members' && parts[3] === 'delete' && req.method === 'POST') {


        memberController.delete_Form(req, res, parts[2])
    }
    // ------------------------------------GET  /   registrations
    if (req.url == "/registrations" && req.method == "GET") {

        registrationController.registration(req, res);
    }
    // ------------------------------------GET  /   registrations/new
    if (req.url == "/registrations/new" && req.method == "GET") {


        registrationController.showRegistrationForm(req, res);
    }
    // ------------------------------------GET  /   registrations
    if (req.url == "/registrations" && req.method == "POST") {


        registrationController.store_Registration(req, res);
    }
    // ---------------------------------------POST /registrations/7/delete 
    if (parts[1] === 'registrations' && parts[3] === 'delete' && req.method === 'POST') {


        registrationController.delete_Registration(req, res, parts[2])
    }










    // console.log(typeof(Number(parts[2])) == "number");
    // console.log(req.method == "GET" );


    // GET /activities/12
    if (parts[1] == "activities" && req.method == "GET" && typeof (Number(parts[2])) == "number") {
        registrationController.id(req, res, Number(parts[2]))
    }
    // GET /stats/activities

    if (req.url == "/stats/activities" && req.method == "GET") {


        registrationController.all(req, res);
    }

}
