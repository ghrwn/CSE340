const express = require("express")
const router = express.Router()
const invController = require("../controllers/inventoryController")
const utilities = require("../utilities")

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
router.get(
  "/error",
  utilities.handleErrors(invController.triggerError)
)

module.exports = router