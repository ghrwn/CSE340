const invModel = require("../models/inventory-model")

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
  let grid = '<ul id="inv-display">'

  data.rows.forEach((vehicle) => {
    grid += `
      <li>
        <a href="#">
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

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other functions in this
 **************************************** */
Util.handleErrors = fn => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util