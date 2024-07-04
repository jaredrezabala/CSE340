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
async function authenticateUser(account_email, account_password) {
  try {
    const sql = "SELECT * FROM account WHERE account_email = $1 AND account_password = $2";
    const result = await pool.query(sql, [account_email, account_password]);

    // Verifica si hay algún resultado encontrado en la base de datos
    if (result.rowCount > 0) {
      return true; // Credenciales válidas
    } else {
      return false; // Credenciales inválidas
    }
  } catch (error) {
    throw new Error(error.message);
  }
}
module.exports = {
  registerAccount,
  checkExistingEmail,
  authenticateUser,
};
