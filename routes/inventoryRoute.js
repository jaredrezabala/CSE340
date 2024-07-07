const express = require("express");
const router = new express.Router();
const utilities = require("../utilities/");
const invController = require("../controllers/invController");
const manageCont = require("../controllers/manageController");
const regValidate = require("../utilities/account-validation");

/*
***Important Note***
I put this "/" at this end of the existing routes here in this file 
and it wasnt working so I changed it to the top and it worked
------THE ROUTES ARE RAN IN ORDER------ 
eg.. I can present the details item view before the home page
could be like trying to get into my room from a window, instead I need
to open the front door, then my room door, etc etc
*/
//Route to build the management inventory view
router.get("/", utilities.handleErrors(manageCont.buildManage));

//Route to add new class
router.get("/newClass", utilities.handleErrors(manageCont.buildNewClass));
//Process adding new class
router.post("/newClass", utilities.handleErrors(manageCont.processNewClass));
//Route to add new vehicle
router.get("/newVehicle", utilities.handleErrors(manageCont.buildNewVehicle));
//Process adding new inventory
router.post("/newVehicle", utilities.handleErrors(manageCont.processNewVehicle));

// Route to build inventory by classification view
router.get(
  "/type/:classificationId",
  utilities.handleErrors(invController.buildByClassificationId)
);

// Route to build inventory by item detail view
router.get(
  "/detail/:inv_Id",
  utilities.handleErrors(invController.buildByItemId)
);
module.exports = router;
