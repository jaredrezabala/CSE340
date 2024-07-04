const express = require("express");
const router = new express.Router();
const utilities = require("../utilities/");
const accountController = require("../controllers/accountController");
const regValidate = require("../utilities/account-validation");

router.get("/login", utilities.handleErrors(accountController.buildLogin));
// Process the login attempt
router.post(
  "/login",
  regValidate.checkLoginData,
  (req, res) => {
    res.status(200).send('login process');
  }
);

router.get(
  "/register",
  utilities.handleErrors(accountController.buildRegister)
);
router.post(
  "/registerAcc",
  regValidate.registationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
);

module.exports = router;
