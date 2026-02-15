const utilities = require("../utilities")
const favoritesModel = require("../models/favorites-model")

/* ***************************
 * Build Favorites View
 * ************************** */
async function buildFavorites(req, res) {
  const nav = await utilities.getNav()
  const account_id = res.locals.accountData.account_id

  const favorites = await favoritesModel.getFavoritesByAccountId(account_id)

  const grid = favorites.length
    ? utilities.buildClassificationGrid({ rows: favorites })
    : "<p>You have no favorite vehicles yet.</p>"

  res.render("favorites/index", {
    title: "My Favorites",
    nav,
    grid,
    favorites,
    errors: null,
  })
}

/* ***************************
 * Add Favorite
 * ************************** */
async function addFavorite(req, res) {
  const account_id = res.locals.accountData.account_id
  const inv_id = parseInt(req.body.inv_id)

  if (Number.isNaN(inv_id)) {
    req.flash("notice", "Invalid vehicle.")
    return res.redirect(req.get("Referer") || "/")
  }

  const added = await favoritesModel.addFavorite(account_id, inv_id)

  if (added) req.flash("success", "Vehicle added to favorites.")
  else req.flash("notice", "Already in favorites or failed.")

  return res.redirect(`/inventory/detail/${inv_id}`)
}

/* ***************************
 * Remove Favorite
 * ************************** */
async function removeFavorite(req, res) {
  const account_id = res.locals.accountData.account_id
  const inv_id = parseInt(req.body.inv_id)

  if (Number.isNaN(inv_id)) {
    req.flash("notice", "Invalid vehicle.")
    return res.redirect("/account/favorites")
  }

  const removed = await favoritesModel.removeFavorite(account_id, inv_id)

  if (removed) req.flash("success", "Favorite removed.")
  else req.flash("notice", "Unable to remove favorite.")

  return res.redirect("/account/favorites")
}

module.exports = {
  buildFavorites,
  addFavorite,
  removeFavorite,
}