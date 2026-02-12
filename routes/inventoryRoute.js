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
  utilities.checkLogin,          // 🔐 Must be logged in
  utilities.checkAccountType,   // 🔐 Employee/Admin only
  utilities.handleErrors(invController.buildManagement)
)

/* ***************************
 * AJAX - Return Inventory JSON by classification
 * /inventory/getInventory/:classification_id
 * ************************** */
router.get(
  "/getInventory/:classification_id(\\d+)",
  utilities.checkLogin,
  utilities.checkAccountType,
  utilities.handleErrors(invController.getInventoryJSON)
)

/* ***************************
 * Build Edit Inventory View (Step 1)
 * /inventory/edit/:invId
 * ************************** */
router.get(
  "/edit/:invId(\\d+)",
  utilities.checkLogin,
  utilities.checkAccountType,
  utilities.handleErrors(invController.buildEditInventory)
)

/* ***************************
 * Process Inventory Update (Step 2)
 * /inventory/update
 * ************************** */
router.post(
  "/update",
  utilities.checkLogin,
  utilities.checkAccountType,
  invValidate.inventoryRules(),
  invValidate.checkUpdateData,
  utilities.handleErrors(invController.updateInventory)
)

/* ***************************
 * Build Delete Confirmation View (Step 1)
 * /inventory/delete/:invId
 * ************************** */
router.get(
  "/delete/:invId(\\d+)",
  utilities.checkLogin,
  utilities.checkAccountType,
  utilities.handleErrors(invController.buildDeleteConfirm)
)

/* ***************************
 * Process Delete Inventory (Step 2)
 * /inventory/delete
 * ************************** */
router.post(
  "/delete",
  utilities.checkLogin,
  utilities.checkAccountType,
  utilities.handleErrors(invController.deleteInventory)
)

/* ***************************
 * Add Classification View
 * /inventory/add-classification
 * ************************** */
router.get(
  "/add-classification",
  utilities.checkLogin,
  utilities.checkAccountType,
  utilities.handleErrors(invController.buildAddClassification)
)

/* ***************************
 * Process Add Classification
 * /inventory/add-classification
 * ************************** */
router.post(
  "/add-classification",
  utilities.checkLogin,
  utilities.checkAccountType,
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
  utilities.checkLogin,
  utilities.checkAccountType,
  utilities.handleErrors(invController.buildAddInventory)
)

/* ***************************
 * Process Add Inventory
 * /inventory/add-inventory
 * ************************** */
router.post(
  "/add-inventory",
  utilities.checkLogin,
  utilities.checkAccountType,
  invValidate.inventoryRules(),
  invValidate.checkInvData,
  utilities.handleErrors(invController.addInventory)
)

/* ***************************
 * Classification View (Public)
 * ************************** */
router.get(
  "/type/:classificationId(\\d+)",
  utilities.handleErrors(invController.buildByClassificationId)
)

/* ***************************
 * Inventory Detail View (Public)
 * ************************** */
router.get(
  "/detail/:invId(\\d+)",
  utilities.handleErrors(invController.buildByInventoryId)
)

/* ***************************
 * Intentional Error Route (500)
 * ************************** */
router.get(
  "/error",
  utilities.handleErrors(invController.triggerError)
)

module.exports = router