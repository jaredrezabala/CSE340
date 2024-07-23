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
* Return account data using email address
* ***************************** */
async function getAccountByEmail (account_email) {
  try {
    const result = await pool.query(
      'SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_email = $1',
      [account_email])
    return result.rows[0]
  } catch (error) {
    return new Error("No matching email found")
  }
}
/* *****************************
* Return account data using account_id
* ***************************** */
async function getAccountById (account_id) {
  try {
    const result = await pool.query(
      'SELECT * FROM account WHERE account_id = $1'
      , [account_id])
      return result.rows[0]
      } catch (error) {
        throw new Error("No matching account_id found")
        }
}
/* *****************************
* Update user account
* ***************************** */
async function updateUser (account_firstname, account_lastname, account_email, account_id ){
  try {
    const sql = 'UPDATE account SET account_firstname = $1, account_lastname = $2, account_email = $3 WHERE account_id = $4 RETURNING  account_firstname, account_lastname, account_email, account_id, account_type'
    const result = await pool.query(sql, [account_firstname, account_lastname, account_email, account_id])
    return result;
  } catch (error) {
    console.log(error.message)
    throw error;
  }
}
/* *****************************
* Update password account
* ***************************** */
async function updatePass ( account_password, account_id ) {
  try {
    const sql = 'UPDATE account SET account_password = $1 WHERE account_id = $2'
    const result = await pool.query(sql, [ account_password, account_id])
    return result;
    } catch (error) {
      // return error.message;
      throw error;
  }
}
/* *****************************
* Select all users to show them in the admin view
* ***************************** */
async function getAllUsers() {
  try {
    const result = await pool.query("SELECT * FROM account");
    return result.rows;
  } catch (error) {
    console.error("Error fetching users", error);
    throw error;
  }
}
/* *****************************
*Update User permission
* ***************************** */
async function updateUserPermissions(account_type, account_id) {
  try {
    const result = await pool.query(
      "UPDATE account  SET account_type = $1 WHERE account_id = $2 RETURNING *",
      [account_type, account_id]
    );
    return result;
  } catch (error) {
    console.error("Error updating user permissions", error);
    throw error;
  }
}
module.exports = {
  registerAccount,
  checkExistingEmail,
  getAccountByEmail,
  getAccountById,
  updateUser,
  updatePass,
  getAllUsers,
  updateUserPermissions
};
