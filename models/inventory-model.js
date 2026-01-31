const pool = require("../database")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications() {
  try {
    const sql =
      "SELECT * FROM public.classification ORDER BY classification_name"
    return await pool.query(sql)
  } catch (error) {
    console.error("getClassifications error:", error)
    throw error
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
    throw error
  }
}

/* ***************************
 *  Get inventory item by inventory id
 * ************************** */
async function getInventoryById(inv_id) {
  try {
    const sql = `
      SELECT *
      FROM public.inventory AS i
      JOIN public.classification AS c
        ON i.classification_id = c.classification_id
      WHERE i.inv_id = $1
    `
    return await pool.query(sql, [inv_id])
  } catch (error) {
    console.error("getInventoryById error:", error)
    throw error
  }
}

module.exports = {
  getClassifications,
  getInventoryByClassificationId,
  getInventoryById,
}