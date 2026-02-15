const express = require("express")
const router = new express.Router()

const utilities = require("../utilities")
const favController = require("../controllers/favoritesController")

/* ***************************
 * Favorites List
 * GET /account/favorites
 * ************************** */
router.get(
  "/",
  utilities.checkLogin,
  utilities.handleErrors(favController.buildFavorites)
)

/* ***************************
 * Add Favorite
 * POST /account/favorites/add
 * ************************** */
router.post(
  "/add",
  utilities.checkLogin,
  utilities.handleErrors(favController.addFavorite)
)

/* ***************************
 * Remove Favorite
 * POST /account/favorites/remove
 * ************************** */
router.post(
  "/remove",
  utilities.checkLogin,
  utilities.handleErrors(favController.removeFavorite)
)

module.exports = router