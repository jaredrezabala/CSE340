const utilities = require("../utilities/");
const bcrypt = require("bcryptjs");
const accountModel = require("../models/account-model");

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
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
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
      errors: null
    });
  } else {
    req.flash("notice", "Sorry, the registration failed.");
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
      errors: null
    });
  }
}
/* ****************************************
 *  Login Process
 * *************************************** */
async function loginAccount(req, res) {
  let nav = await utilities.getNav();
  const { account_email, account_password } = req.body;
  const loginResult = await accountModel.checkUserPassword(
    account_email,
    account_password
  );
  //parece que el res.statud acontinuacion no estan funcionando proque cuando se logea deberia redirigir a la pagina de inicio pero nada esta es usando lo otro que esta en el accountRoute, sera que talvez si comento eso que esta en el account route haga que lo que tengo aqui funcione?
  if (loginResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re logged in ${account_firstname}.`
    );
    res.status(201).render("/", {
      title: "Home",
      nav,
      errors: null
    });
  } else {
    req.flash(
      "notice",
      "Sorry, You entered an invalid username or password."
    );
    res.status(501).render("account/login", {
      title: "Login",
      nav,
      errors: null
    });
  }
}

module.exports = { buildLogin, buildRegister, registerAccount, loginAccount };
