const utilities = require("../utilities/");
const bcrypt = require("bcryptjs");
const accountModel = require("../models/account-model");
const jwt = require("jsonwebtoken");
require("dotenv").config();

/* ****************************************
 *  Deliver login view
 * *************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/login", {
    title: "Login",
    nav,
    errors: null,
  });
}
/* ****************************************
 *  Deliver registration view
 * *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
  });
}
/* ****************************************
 *  Deliver Account Management view
 * *************************************** */
async function buildAccountManagement(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/account-management", {
    title: "Account Management",
    nav,
    errors: null,
  });
}
/* ****************************************
 *  Deliver Edit Account View
 * *************************************** */
async function buildEditAccountView(req, res, next){
  let nav = await utilities.getNav();
  res.render("account/update-view",{
    title: "Edit Account",
    nav,
    errors: null,
    });
  }
/* ****************************************
 *  Process Registration
 * *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav();
  const {
    account_firstname,
    account_lastname,
    account_email,
    account_password,
  } = req.body;
  // Hash the password before storing
  let hashedPassword;
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10);
  } catch (error) {
    req.flash(
      "notice",
      "Sorry, there was an error processing the registration."
    );
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    });
  }
  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  );

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    );
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      errors: null,
    });
  } else {
    req.flash("notice", "Sorry, the registration failed.");
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    });
  }
}
/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav();
  const { account_email, account_password } = req.body;
  const accountData = await accountModel.getAccountByEmail(account_email);
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.");
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    });
    return;
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password;
      const accessToken = jwt.sign(
        accountData,
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: 3600 }
      );
      if (process.env.NODE_ENV === "development") {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 });
      } else {
        res.cookie("jwt", accessToken, {
          httpOnly: true,
          secure: true,
          maxAge: 3600 * 1000,
        });
      }
      return res.redirect("/account/");
    } else {
      req.flash("notice", "Please check your password and try again.");
      res.status(400).render("./account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      });
    }
  } catch (error) {
    throw new Error("Access Forbidden");
  }
}
/* ****************************************
 *  Process user update request
 * ************************************ */
async function editUserInfo(req, res){
  // const account_id = parseInt(req.params.account_id)
  const { account_firstname, account_lastname, account_email, account_id } = req.body;
  const updatedUser = await accountModel.updateUser(
    account_firstname,
    account_lastname,
    account_email,
    account_id
  )
  if (updatedUser) {
    req.flash("notice", "Your account information has been updated.");
    // res.locals.accountData.account_firstname = updatedUser.rows[0].account_firstname
    // res.locals.accountData.account_lastname = updatedUser.rows[0].account_lastname
    // res.locals.accountData.account_email = updatedUser.rows[0].account_email
    const accessToken = jwt.sign(
      updatedUser.rows[0],
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: 3600 }
    );
    if (process.env.NODE_ENV === "development") {
      res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 });
    } else {
      res.cookie("jwt", accessToken, {
        httpOnly: true,
        secure: true,
        maxAge: 3600 * 1000,
      });
    }
    res.redirect("/account/");
  }else{
    req.flash("notice", "Please check your information and try again.");
    res.redirect("/account/edit");
  }
}
/* ****************************************
 *  Process password update request
 * ************************************ */
async function editPassword(){
  const { account_password } = req.body;
   // Hash the password before storing
   let hashedPassword;
   try {
     // regular password and cost (salt is generated automatically)
     hashedPassword = await bcrypt.hashSync(account_password, 10);
   } catch (error) {
     req.flash(
       "notice",
       "Sorry, there was an error updating your password."
     );
     res.redirect("account/edit");
    }
  const updatedPass = await accountModel.updatePass(hashedPassword);
  if (updatedPass) {
    req.flash("notice", "Your password has been updated.");
    res.redirect("/account/");
  }else{
    req.flash("notice", "Please check your password and try again.");
    res.redirect("/account/edit");
  }
}

module.exports = {
  buildLogin,
  buildRegister,
  registerAccount,
  accountLogin,
  buildAccountManagement,
  buildEditAccountView,
  editUserInfo,
  editPassword
};
