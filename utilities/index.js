const invModel = require("../models/inventory-model")
const accountModel = require("../models/account-model")
const jwt = require("jsonwebtoken")
require("dotenv").config()

const Util = {}

/* ***************************
 * Build the navigation HTML
 * ************************** */
Util.getNav = async function () {
  const data = await invModel.getClassifications()
  let nav = "<ul>"
  nav += '<li><a href="/" title="Home page">Home</a></li>'

  data.rows.forEach((row) => {
    nav += `
      <li>
        <a href="/inventory/type/${row.classification_id}"
           title="View ${row.classification_name} vehicles">
          ${row.classification_name}
        </a>
      </li>
    `
  })

  nav += "</ul>"
  return nav
}

/* ***************************
 * Build inventory list HTML
 * ************************** */
Util.buildClassificationGrid = function (data) {
  let grid = '<ul class="inv-display">'

  data.rows.forEach((vehicle) => {
    grid += `
      <li>
        <a href="/inventory/detail/${vehicle.inv_id}">
          <img src="${vehicle.inv_thumbnail}"
               alt="Image of ${vehicle.inv_make} ${vehicle.inv_model}">
          <h2>${vehicle.inv_make} ${vehicle.inv_model}</h2>
        </a>
        <span>$${Number(vehicle.inv_price).toLocaleString()}</span>
      </li>
    `
  })

  grid += "</ul>"
  return grid
}

/* ***************************
 * Build inventory detail HTML
 * ************************** */
Util.buildInventoryDetail = function (vehicle) {
  return `
    <section class="vehicle-detail">
      <div class="vehicle-detail-image">
        <img src="${vehicle.inv_image}"
             alt="Image of ${vehicle.inv_make} ${vehicle.inv_model}">
      </div>

      <div class="vehicle-detail-info">
        <h2>${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}</h2>

        <p class="price">
          <strong>Price:</strong>
          $${Number(vehicle.inv_price).toLocaleString()}
        </p>

        <p>
          <strong>Mileage:</strong>
          ${Number(vehicle.inv_miles).toLocaleString()} miles
        </p>

        <p>
          <strong>Description:</strong>
          ${vehicle.inv_description}
        </p>

        <p>
          <strong>Color:</strong>
          ${vehicle.inv_color}
        </p>
      </div>
    </section>
  `
}

/* ****************************************
 * Middleware For Handling Errors
 **************************************** */
Util.handleErrors = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next)

/* ***************************
 * Build classification select list
 * ************************** */
Util.buildClassificationList = async function (classification_id = null) {
  let data = await invModel.getClassifications()
  let classificationList =
    '<select name="classification_id" id="classificationList" required>'
  classificationList += "<option value=''>Choose a Classification</option>"
  data.rows.forEach((row) => {
    classificationList += '<option value="' + row.classification_id + '"'
    if (classification_id != null && row.classification_id == classification_id) {
      classificationList += " selected "
    }
    classificationList += ">" + row.classification_name + "</option>"
  })
  classificationList += "</select>"
  return classificationList
}

/* ****************************************
 * Middleware to check token validity
 **************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies && req.cookies.jwt) {
    jwt.verify(
      req.cookies.jwt,
      process.env.ACCESS_TOKEN_SECRET,
      function (err, accountData) {
        if (err) {
          req.flash("notice", "Please log in.")
          res.clearCookie("jwt")
          return res.redirect("/account/login")
        }
        res.locals.accountData = accountData
        res.locals.loggedin = 1
        next()
      }
    )
  } else {
    next()
  }
}

/* ***************************
 * Require login middleware (protect routes)
 * ************************** */
Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    return next()
  }
  req.flash("notice", "Please log in to access that area.")
  return res.redirect("/account/login")
}

/* ***************************
 * Check account type middleware (Employee/Admin only)
 * ************************** */
Util.checkAccountType = (req, res, next) => {
  const account = res.locals.accountData

  // Not logged in → send to login
  if (!account) {
    req.flash("notice", "Please log in to access that area.")
    return res.redirect("/account/login")
  }

  // Logged in but wrong type → send to account management (NOT login)
  const type = account.account_type
  if (type === "Employee" || type === "Admin") {
    return next()
  }

  req.flash("notice", "Employee or Admin access required.")
  return res.redirect("/account/")
}

/* ***************************
 * Middleware to build locals for views
 * ************************** */
Util.setLocals = async (req, res, next) => {
  res.locals.nav = await Util.getNav()
  return next()
}

module.exports = Util