const express = require("express")
const router = express.Router()

// Serve static files ONLY
router.use("/css", express.static("public/css"))
router.use("/images", express.static("public/images"))
router.use("/js", express.static("public/js"))

module.exports = router