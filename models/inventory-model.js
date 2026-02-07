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

/* ***************************
 *  Add new inventory item
 * ************************** */
async function addInventory(invData) {
  try {
    const sql = `
      INSERT INTO public.inventory
      (inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id)
      VALUES
      ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
      RETURNING *
    `
    const params = [
      invData.inv_make,
      invData.inv_model,
      invData.inv_year,
      invData.inv_description,
      invData.inv_image,
      invData.inv_thumbnail,
      invData.inv_price,
      invData.inv_miles,
      invData.inv_color,
      invData.classification_id,
    ]
    return await pool.query(sql, params)
  } catch (error) {
    return error.message
  }
}

module.exports = {
  getClassifications,
  getInventoryByClassificationId,
  getInventoryById,
  addInventory,
}