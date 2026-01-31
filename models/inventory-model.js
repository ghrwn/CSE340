const pool = require("../database")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications() {
  try {
    return await pool.query(
      "SELECT * FROM public.classification ORDER BY classification_name"
    )
  } catch (error) {
    console.error("getClassifications error:", error)
  }
}

/* ***************************
 *  Get inventory by classification id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const sql = `
      SELECT * 
      FROM public.inventory AS i
      JOIN public.classification AS c
      ON i.classification_id = c.classification_id
      WHERE i.classification_id = $1
    `
    return await pool.query(sql, [classification_id])
  } catch (error) {
    console.error("getInventoryByClassificationId error:", error)
  }
}

module.exports = {
  getClassifications,
  getInventoryByClassificationId,
}