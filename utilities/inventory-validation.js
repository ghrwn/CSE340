const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}

/* ******************************
 * Inventory Data Validation Rules
 * ***************************** */
validate.inventoryRules = () => {
  return [
    body("classification_id")
      .trim()
      .notEmpty()
      .withMessage("Please choose a classification."),

    body("inv_make")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 2 })
      .withMessage("Please provide a make (min 2 characters)."),

    body("inv_model")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide a model."),

    body("inv_year")
      .trim()
      .notEmpty()
      .isInt({ min: 1900, max: 2099 })
      .withMessage("Please provide a valid 4-digit year."),

    body("inv_description")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 10 })
      .withMessage("Please provide a description (min 10 characters)."),

    body("inv_image")
      .trim()
      .notEmpty()
      .withMessage("Please provide an image path."),

    body("inv_thumbnail")
      .trim()
      .notEmpty()
      .withMessage("Please provide a thumbnail path."),

    body("inv_price")
      .trim()
      .notEmpty()
      .isFloat({ min: 0 })
      .withMessage("Please provide a valid price."),

    body("inv_miles")
      .trim()
      .notEmpty()
      .isInt({ min: 0 })
      .withMessage("Please provide valid miles (digits only)."),

    body("inv_color")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 3 })
      .withMessage("Please provide a color."),
  ]
}

/* ******************************
 * Check inventory data and return errors or continue to insertion
 * ***************************** */
validate.checkInvData = async (req, res, next) => {
  let errors = validationResult(req)

  const {
    classification_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
  } = req.body

  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    let classificationSelect = await utilities.buildClassificationList(classification_id)

    res.render("inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      errors,
      classificationSelect,
      classification_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
    })
    return
  }
  next()
}

module.exports = validate