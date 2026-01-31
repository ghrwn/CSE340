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
 * Wrap other functions in this
 **************************************** */
Util.handleErrors = fn => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util