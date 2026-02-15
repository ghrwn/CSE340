const pool = require("../database")

/* ***************************
 * Add Favorite
 * ************************** */
async function addFavorite(account_id, inv_id) {
  try {
    const sql = `
      INSERT INTO favorites (account_id, inv_id)
      VALUES ($1, $2)
      ON CONFLICT (account_id, inv_id) DO NOTHING
      RETURNING favorite_id
    `
    const data = await pool.query(sql, [account_id, inv_id])
    return data.rowCount > 0
  } catch (error) {
    console.error("addFavorite error:", error)
    return false
  }
}

/* ***************************
 * Get Favorites by Account
 * ************************** */
async function getFavoritesByAccountId(account_id) {
  try {
    const sql = `
      SELECT i.*
      FROM favorites f
      JOIN inventory i
        ON f.inv_id = i.inv_id
      WHERE f.account_id = $1
      ORDER BY f.favorite_id DESC
    `
    const data = await pool.query(sql, [account_id])
    return data.rows
  } catch (error) {
    console.error("getFavoritesByAccountId error:", error)
    return []
  }
}

/* ***************************
 * Remove Favorite
 * ************************** */
async function removeFavorite(account_id, inv_id) {
  try {
    const sql = `
      DELETE FROM favorites
      WHERE account_id = $1 AND inv_id = $2
      RETURNING favorite_id
    `
    const data = await pool.query(sql, [account_id, inv_id])
    return data.rowCount > 0
  } catch (error) {
    console.error("removeFavorite error:", error)
    return false
  }
}

module.exports = {
  addFavorite,
  getFavoritesByAccountId,
  removeFavorite,
}