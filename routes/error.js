const express = require("express");
const router = new express.Router();
const utilities = require("../utilities/");
const errCont = require("../controllers/errorController");

router.get(
  "/intentional-error",
  utilities.handleErrors(errCont.createIntentionalError)
);
module.exports = router;
