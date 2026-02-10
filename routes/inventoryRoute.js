const express = require("express")
const router = express.Router()
const invController = require("../controllers/inventoryController")
const utilities = require("../utilities")
const invValidate = require("../utilities/inventory-validation")

/* ***************************
 * Management View
 * /inventory
 * ************************** */
router.get(
  "/",
  utilities.checkLogin, // 🔐 PROTECTED
  utilities.handleErrors(invController.buildManagement)
)

/* ***************************
 * Add Classification View
 * ************************** */
router.get(
  "/add-classification",
  utilities.checkLogin, // 🔐 PROTECTED
  utilities.handleErrors(invController.buildAddClassification)
)

/* ***************************
 * Process Add Classification
 * ************************** */
router.post(
  "/add-classification",
  utilities.checkLogin, // 🔐 PROTECTED
  invValidate.classificationRules(),
  invValidate.checkClassificationData,
  utilities.handleErrors(invController.addClassification)
)

/* ***************************
 * Add Inventory View
 * ************************** */
router.get(
  "/add-inventory",
  utilities.checkLogin, // 🔐 PROTECTED
  utilities.handleErrors(invController.buildAddInventory)
)

/* ***************************
 * Process Add Inventory
 * ************************** */
router.post(
  "/add-inventory",
  utilities.checkLogin, // 🔐 PROTECTED
  invValidate.inventoryRules(),
  invValidate.checkInvData,
  utilities.handleErrors(invController.addInventory)
)

/* ***************************
 * Classification View
 * (Public — customers can browse)
 * ************************** */
router.get(
  "/type/:classificationId",
  utilities.handleErrors(invController.buildByClassificationId)
)

/* ***************************
 * Inventory Detail View
 * (Public)
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