const invModel = require("../models/inventory-model")
const utilities = require("../utilities")

/* ***************************
 * Build Inventory Management View
 * ************************** */
async function buildManagement(req, res) {
  const nav = await utilities.getNav()
  const classificationSelect = await utilities.buildClassificationList()

  res.render("inventory/management", {
    title: "Vehicle Management",
    nav,
    errors: null,
    classificationSelect,
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
    const nav = await utilities.getNav()
    const classificationSelect = await utilities.buildClassificationList()

    return res.status(201).render("inventory/management", {
      title: "Vehicle Management",
      nav,
      errors: null,
      classificationSelect,
    })
  }

  req.flash("notice", "Sorry, the classification was not added.")
  const nav = await utilities.getNav()
  return res.status(500).render("inventory/add-classification", {
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
    const classificationSelect = await utilities.buildClassificationList()

    return res.status(201).render("inventory/management", {
      title: "Vehicle Management",
      nav,
      errors: null,
      classificationSelect,
    })
  }

  req.flash("notice", "Sorry, the inventory item was not added.")
  const classificationSelect = await utilities.buildClassificationList(
    invData.classification_id
  )

  return res.status(500).render("inventory/add-inventory", {
    title: "Add Inventory",
    nav,
    errors: null,
    classificationSelect,
    ...invData,
  })
}

/* ***************************
 * Build Edit Inventory View (Step 1)
 * ************************** */
async function buildEditInventory(req, res, next) {
  try {
    const inv_id = parseInt(req.params.invId)
    const nav = await utilities.getNav()

    const data = await invModel.getInventoryById(inv_id)
    if (!data || !data.rows || data.rows.length === 0) {
      const err = new Error("Vehicle not found")
      err.status = 404
      throw err
    }

    const itemData = data.rows[0]
    const classificationSelect = await utilities.buildClassificationList(
      itemData.classification_id
    )
    const itemName = `${itemData.inv_make} ${itemData.inv_model}`

    const inv_price =
      itemData.inv_price !== null && itemData.inv_price !== undefined
        ? Number(itemData.inv_price)
        : ""
    const inv_year =
      itemData.inv_year !== null && itemData.inv_year !== undefined
        ? Number(itemData.inv_year)
        : ""
    const inv_miles =
      itemData.inv_miles !== null && itemData.inv_miles !== undefined
        ? Number(itemData.inv_miles)
        : ""

    res.render("inventory/edit-inventory", {
      title: "Edit " + itemName,
      nav,
      classificationSelect,
      errors: null,
      inv_id: itemData.inv_id,
      inv_make: itemData.inv_make,
      inv_model: itemData.inv_model,
      inv_year,
      inv_description: itemData.inv_description,
      inv_image: itemData.inv_image,
      inv_thumbnail: itemData.inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color: itemData.inv_color,
      classification_id: itemData.classification_id,
    })
  } catch (error) {
    next(error)
  }
}

/* ***************************
 * Update Inventory Data (Step 2)
 * ************************** */
async function updateInventory(req, res, next) {
  try {
    const nav = await utilities.getNav()

    const {
      inv_id,
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      classification_id,
    } = req.body

    const updateResult = await invModel.updateInventory(
      inv_id,
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      classification_id
    )

    if (updateResult) {
      const itemName = `${updateResult.inv_make} ${updateResult.inv_model}`
      req.flash("notice", `The ${itemName} was successfully updated.`)
      return res.redirect("/inventory/")
    }

    const classificationSelect = await utilities.buildClassificationList(
      classification_id
    )
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the update failed.")

    return res.status(501).render("inventory/edit-inventory", {
      title: "Edit " + itemName,
      nav,
      classificationSelect,
      errors: null,
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id,
    })
  } catch (error) {
    next(error)
  }
}

/* ***************************
 * Build Delete Confirmation View (Step 1)
 * ************************** */
async function buildDeleteConfirm(req, res, next) {
  try {
    const inv_id = parseInt(req.params.invId)
    const nav = await utilities.getNav()

    const data = await invModel.getInventoryById(inv_id)
    if (!data || !data.rows || data.rows.length === 0) {
      const err = new Error("Vehicle not found")
      err.status = 404
      throw err
    }

    const itemData = data.rows[0]
    const itemName = `${itemData.inv_make} ${itemData.inv_model}`

    const inv_price =
      itemData.inv_price !== null && itemData.inv_price !== undefined
        ? Number(itemData.inv_price)
        : ""
    const inv_year =
      itemData.inv_year !== null && itemData.inv_year !== undefined
        ? Number(itemData.inv_year)
        : ""

    return res.render("inventory/delete-confirm", {
      title: "Delete " + itemName,
      nav,
      errors: null,
      inv_id: itemData.inv_id,
      inv_make: itemData.inv_make,
      inv_model: itemData.inv_model,
      inv_year,
      inv_price,
    })
  } catch (error) {
    next(error)
  }
}

/* ***************************
 * Delete Inventory Item (Step 2)
 * ************************** */
async function deleteInventory(req, res, next) {
  try {
    const inv_id = parseInt(req.body.inv_id)

    const deleteResult = await invModel.deleteInventoryItem(inv_id)

    if (deleteResult && deleteResult.rowCount > 0) {
      req.flash("notice", "Inventory item successfully deleted.")
      return res.redirect("/inventory/")
    }

    req.flash("notice", "Sorry, the delete failed.")
    return res.redirect(`/inventory/delete/${inv_id}`)
  } catch (error) {
    next(error)
  }
}

/* ***************************
 * Build inventory by classification view (Public)
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
 * Build inventory detail view (Public)
 * ************************** */
async function buildByInventoryId(req, res, next) {
  try {
    const inv_id = parseInt(req.params.invId)
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
      inv_id: vehicle.inv_id,
    })
  } catch (error) {
    next(error)
  }
}

/* ***************************
 * Return Inventory by Classification as JSON (AJAX)
 * ************************** */
async function getInventoryJSON(req, res, next) {
  try {
    const classification_id = parseInt(req.params.classification_id)
    if (Number.isNaN(classification_id)) {
      return res.status(400).json({ error: "Invalid classification_id" })
    }
    const invData = await invModel.getInventoryByClassificationId(classification_id)
    return res.json(invData.rows)
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
  buildEditInventory,
  updateInventory,
  buildDeleteConfirm,
  deleteInventory,
  buildByClassificationId,
  buildByInventoryId,
  getInventoryJSON,
  triggerError,
}