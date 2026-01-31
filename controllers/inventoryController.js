const invModel = require("../models/inventory-model")
const utilities = require("../utilities")

/* ***************************
 *  Build inventory by classification view
 * ************************** */
async function buildByClassificationId(req, res, next) {
  try {
    const classification_id = req.params.classificationId
    const data = await invModel.getInventoryByClassificationId(classification_id)
    const nav = await utilities.getNav()
    const grid = utilities.buildClassificationGrid(data)

    res.render("inventory/classification", {
      title: data.rows[0].classification_name + " Vehicles",
      nav,
      grid,
    })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  buildByClassificationId,
}