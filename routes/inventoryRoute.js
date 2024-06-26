const express = require("express");
const router = new express.Router();
const utilities = require("../utilities/");
const invController = require("../controllers/invController");
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
