var express = require("express");
const CampaginController = require("../controllers/CampaginController");
const AuthController = require("../controllers/AuthController");
var router = express.Router();



router.post('/campagin', CampaginController.createCampagin);
router.post('/changePassword', AuthController.changePassword);
router.post('/addUser', AuthController.addUser);
router.get('/user', AuthController.getAllUsers);
router.put('/campagin/:id', CampaginController.updateCampagin);
router.get('/campagin', CampaginController.getAllCampagin);
router.post('/campagin/:datasolution', CampaginController.getBydataSolution);
router.get('/campaginscount', CampaginController.getCampaignCounts);


module.exports = router;
