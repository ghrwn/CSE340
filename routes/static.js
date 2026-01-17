const express = require("express")
const router = express.Router()

// Serve static files from the public folder
router.use(express.static("public"))

module.exports = router