const pool = require("../database");

/* *****************************
 *   Register new account
 * *************************** */
async function registerAccount(
  account_firstname,
  account_lastname,
  account_email,
  account_password
) {
  try {
    const sql =
      "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *";
    return await pool.query(sql, [
      account_firstname,
      account_lastname,
      account_email,
      account_password,
    ]);
  } catch (error) {
    return error.message;
  }
}
async function checkExistingEmail(account_email) {
  try {
    const sql = "SELECT * FROM account WHERE account_email = $1";
    const email = await pool.query(sql, [account_email]);
    return email.rowCount;
  } catch (error) {
    return error.message;
  }
}
/* *****************************
 *   Login Process
 * *************************** */
async function checkUserLogin(account_email, account_password) {
  try {
    const sql2 =
      "SELECT * FROM account WHERE account_email = $1 AND account_password = $2";
    const result = await pool.query(sql2, [account_email, account_password]);
    return result.rowCount;
  } catch (error) {
    return error.message;
  }
}
async function checkUserPassword(account_email, account_password) {
  try {
    const sql3 = "SELECT * FROM account WHERE account_email = $1 AND account_password = $2";
    const result = await pool.query(sql3, [account_email, account_password]);
    return result.rows.length > 0;
    } catch (error) {
      return error.message;
  }
}

module.exports = {
  registerAccount,
  checkExistingEmail,
  checkUserLogin,
  checkUserPassword,
};
