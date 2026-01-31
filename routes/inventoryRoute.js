const express = require("express")
const router = express.Router()
const invController = require("../controllers/inventoryController")

router.get("/type/:classificationId", invController.buildByClassificationId)

module.exports = router