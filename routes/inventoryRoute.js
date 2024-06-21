const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);
// Route to build inventory by item detail view
router.get("/detail/:inv_Id", invController.buildByItemId);

module.exports = router;
