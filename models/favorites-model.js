const pool = require("../database")


// Add a favorite
async function addFavorite(account_id, inv_id) {
  try {
    const sql = `
      INSERT INTO favorites (account_id, inv_id)
      VALUES ($1, $2)
      ON CONFLICT DO NOTHING
      RETURNING *;
    `
    const result = await pool.query(sql, [account_id, inv_id])
    return result.rows[0]
  } catch (error) {
    console.error("Error adding favorite:", error)
    throw error
  }
}

// Get all favorites for an account
async function getFavoritesByAccount(account_id) {
  const sql = `
    SELECT f.favorite_id, i.inv_make, i.inv_model, i.inv_year, i.inv_id
    FROM favorites f
    JOIN inventory i ON f.inv_id = i.inv_id
    WHERE f.account_id = $1
  `
  const result = await pool.query(sql, [account_id])
  return result.rows
}

// Remove a favorite
async function removeFavorite(account_id, inv_id) {
  const sql = `DELETE FROM favorites WHERE account_id = $1 AND inv_id = $2`
  await pool.query(sql, [account_id, inv_id])
}
// Check if a vehicle is a favorite for a specific account
async function checkIfFavorite(account_id, inv_id) {
  const sql = `SELECT 1 FROM favorites WHERE account_id = $1 AND inv_id = $2`;
  const result = await pool.query(sql, [account_id, inv_id]);
  return result.rowCount > 0;
}
async function getFavoritesByUser(account_id) {
  const sql = `
    SELECT i.*
    FROM favorites f
    JOIN inventory i ON f.inv_id = i.inv_id
    WHERE f.account_id = $1
    ORDER BY i.inv_make, i.inv_model
  `;
  const result = await pool.query(sql, [account_id]);
  return result.rows;
}

module.exports = { 
  addFavorite, 
  getFavoritesByAccount, 
  removeFavorite,
  checkIfFavorite, 
  getFavoritesByUser
}
