const invModel = require("../models/inventory-model")
const utilities = require("../utilities")

/* ***************************
 * Build inventory by classification view
 * ************************** */
async function buildByClassificationId(req, res, next) {
  try {
    const classification_id = req.params.classificationId
    const data = await invModel.getInventoryByClassificationId(classification_id)

    if (!data.rows.length) {
      const err = new Error("No vehicles found")
      err.status = 404
      throw err
    }

    const nav = await utilities.getNav()
    const grid = utilities.buildClassificationGrid(data)

    res.render("inventory/classification", {
      title: `${data.rows[0].classification_name} Vehicles`,
      nav,
      grid,
    })
  } catch (error) {
    next(error)
  }
}

/* ***************************
 * Build inventory detail view
 * ************************** */
async function buildByInventoryId(req, res, next) {
  try {
    const inv_id = req.params.invId
    const data = await invModel.getInventoryById(inv_id)

    if (!data.rows.length) {
      const err = new Error("Vehicle not found")
      err.status = 404
      throw err
    }

    const vehicle = data.rows[0]
    const nav = await utilities.getNav()
    const detailHTML = utilities.buildInventoryDetail(vehicle)

    res.render("inventory/detail", {
      title: `${vehicle.inv_make} ${vehicle.inv_model}`,
      nav,
      detailHTML,
    })
  } catch (error) {
    next(error)
  }
}

/* ***************************
 * Intentional error (500)
 * ************************** */
async function triggerError(req, res, next) {
  try {
    throw new Error("Intentional server error")
  } catch (error) {
    error.status = 500
    next(error)
  }
}

module.exports = {
  buildByClassificationId,
  buildByInventoryId,
  triggerError,
}