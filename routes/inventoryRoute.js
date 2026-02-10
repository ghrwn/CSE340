const express = require("express")
const router = express.Router()
const invController = require("../controllers/inventoryController")
const utilities = require("../utilities")
const invValidate = require("../utilities/inventory-validation")

/* ***************************
 * Management View
 * /inventory
 * ************************** */
router.get("/", utilities.handleErrors(invController.buildManagement))

/* ***************************
 * Add Classification View
 * /inventory/add-classification
 * ************************** */
router.get(
  "/add-classification",
  utilities.handleErrors(invController.buildAddClassification)
)

/* ***************************
 * Process Add Classification
 * /inventory/add-classification
 * ************************** */
router.post(
  "/add-classification",
  invValidate.classificationRules(),
  invValidate.checkClassificationData,
  utilities.handleErrors(invController.addClassification)
)

/* ***************************
 * Add Inventory View
 * /inventory/add-inventory
 * ************************** */
router.get(
  "/add-inventory",
  utilities.handleErrors(invController.buildAddInventory)
)

/* ***************************
 * Process Add Inventory
 * /inventory/add-inventory
 * ************************** */
router.post(
  "/add-inventory",
  invValidate.inventoryRules(),
  invValidate.checkInvData,
  utilities.handleErrors(invController.addInventory)
)

/* ***************************
 * Classification View
 * ************************** */
router.get(
  "/type/:classificationId",
  utilities.handleErrors(invController.buildByClassificationId)
)

/* ***************************
 * Inventory Detail View
 * ************************** */
router.get(
  "/detail/:invId",
  utilities.handleErrors(invController.buildByInventoryId)
)

/* ***************************
 * Intentional Error Route (500)
 * ************************** */
router.get("/error", utilities.handleErrors(invController.triggerError))

module.exports = router