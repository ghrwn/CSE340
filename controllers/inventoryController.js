const invModel = require("../models/inventory-model")
const utilities = require("../utilities")

/* ***************************
 * Build Inventory Management View
 * ************************** */
async function buildManagement(req, res) {
  const nav = await utilities.getNav()
  res.render("inventory/management", {
    title: "Vehicle Management",
    nav,
    errors: null,
  })
}

/* ***************************
 * Deliver Add Classification View
 * ************************** */
async function buildAddClassification(req, res) {
  const nav = await utilities.getNav()
  res.render("inventory/add-classification", {
    title: "Add Classification",
    nav,
    errors: null,
    classification_name: "",
  })
}

/* ***************************
 * Process Add Classification
 * ************************** */
async function addClassification(req, res) {
  const { classification_name } = req.body

  const insertResult = await invModel.addClassification(classification_name)

  if (insertResult && insertResult.rowCount > 0) {
    req.flash("notice", "New classification successfully added.")
    const nav = await utilities.getNav() // rebuild nav so new item appears immediately
    res.status(201).render("inventory/management", {
      title: "Vehicle Management",
      nav,
      errors: null,
    })
    return
  }

  req.flash("notice", "Sorry, the classification was not added.")
  const nav = await utilities.getNav()
  res.status(500).render("inventory/add-classification", {
    title: "Add Classification",
    nav,
    errors: null,
    classification_name,
  })
}

/* ***************************
 * Deliver Add Inventory View
 * ************************** */
async function buildAddInventory(req, res) {
  const nav = await utilities.getNav()
  const classificationSelect = await utilities.buildClassificationList()

  res.render("inventory/add-inventory", {
    title: "Add Inventory",
    nav,
    errors: null,
    classificationSelect,
  })
}

/* ***************************
 * Process Add Inventory
 * ************************** */
async function addInventory(req, res) {
  const nav = await utilities.getNav()

  const invData = {
    classification_id: req.body.classification_id,
    inv_make: req.body.inv_make,
    inv_model: req.body.inv_model,
    inv_year: req.body.inv_year,
    inv_description: req.body.inv_description,
    inv_image: req.body.inv_image,
    inv_thumbnail: req.body.inv_thumbnail,
    inv_price: req.body.inv_price,
    inv_miles: req.body.inv_miles,
    inv_color: req.body.inv_color,
  }

  const result = await invModel.addInventory(invData)

  if (result && result.rowCount > 0) {
    req.flash("notice", "New inventory item successfully added.")
    const nav = await utilities.getNav()
    res.status(201).render("inventory/management", {
      title: "Vehicle Management",
      nav,
      errors: null,
    })
    return
  }

  req.flash("notice", "Sorry, the inventory item was not added.")
  const classificationSelect = await utilities.buildClassificationList(invData.classification_id)
  res.status(500).render("inventory/add-inventory", {
    title: "Add Inventory",
    nav,
    errors: null,
    classificationSelect,
    ...invData,
  })
}

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
  buildManagement,
  buildAddClassification,
  addClassification,
  buildAddInventory,
  addInventory,
  buildByClassificationId,
  buildByInventoryId,
  triggerError,
}