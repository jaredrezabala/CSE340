const express = require("express");
const router = new express.Router();
const utilities = require("../utilities/");
const accountController = require("../controllers/accountController");
const regValidate = require("../utilities/account-validation");

// View to display once the login is successful
router.get(
  "/",
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildAccountManagement)
);

router.get("/login", utilities.handleErrors(accountController.buildLogin));
// Process the login attempt
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
);
router.get(
  "/register",
  utilities.handleErrors(accountController.buildRegister)
);
router.post(
  "/register",
  regValidate.registationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
);

// Route to display edit account view
router.get("/edit", utilities.handleErrors(accountController.buildEditAccountView))
// Process the edit account request
router.post("/editAccount", regValidate.updateUserRules(), regValidate.checkEditInfo, utilities.handleErrors(accountController.editUserInfo))
// Process the edit of the password
router.post("/updatePass", regValidate.updatePassRules(), regValidate.checkPassUpdate, utilities.handleErrors(accountController.editPassword))
//Process to logout
router.get("/logout", utilities.handleErrors(accountController.logoutUser))
// Route to display admin view
router.get("/admin", utilities.handleErrors(accountController.buildAdminView))
// Process admin permissions
router.post("/grant", utilities.handleErrors(accountController.grantUserPermissions));
module.exports = router;
