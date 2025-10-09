/* models/account-model.js */

const pool = require("../database/")


/* ***************************
/* *****************************
*   Register new account
* *************************** */
async function registerAccount(account_firstname, account_lastname, account_email, account_password){
  try {
    const sql = "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *"
    return await pool.query(sql, [account_firstname, account_lastname, account_email, account_password])
  } catch (error) {
    return error.message
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
/* Get account by account_id */
/* ***************************** */
async function getAccountById(account_id) {
  const sql = 'SELECT * FROM public.account WHERE account_id = $1'
  const result = await pool.query(sql, [account_id])
  return result.rows[0]
}
/* *****************************
/* Update account info (first name, last name, email) */
/* ***************************** */
async function updateAccountInfo(account) {
  try {
    const sql = `
      UPDATE account
      SET account_firstname = $1,
          account_lastname = $2,
          account_email = $3
      WHERE account_id = $4
      RETURNING *;
    `;
    const values = [
      account.account_firstname,
      account.account_lastname,
      account.account_email,
      account.account_id
    ];
    const result = await pool.query(sql, values);
    return result.rows[0];
  } catch (error) {
    console.error("Error updating account:", error);
    throw error;
  }
}

/* ***************************** */
/* Update account password */
/* ***************************** */
async function updateAccountPassword(account_id, hashedPassword) {
  const sql = `
    UPDATE public.account
    SET account_password = $1
    WHERE account_id = $2
  `
  const result = await pool.query(sql, [hashedPassword, account_id])
  return result.rowCount > 0
}


/* *****************************    
export the functions
* *************************** */
module.exports = {
  registerAccount,
  getAccountByEmail, 
  getAccountById,
  updateAccountInfo,
  updateAccountPassword}