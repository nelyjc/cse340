/**utilities/inventory validation js
 * 
 */
const { body, validationResult } = require("express-validator")
const utilities = require(".")

const validate = {}

/* ***************************
 *  Inventory Data Validation Rules
 * ************************** */
validate.newInventoryRules = () => {
  return [
    body("inv_make")
      .trim()
      .isLength({ min: 3 })
      .withMessage("Please provide a make with at least 3 characters."),
    body("inv_model")
      .trim()
      .isLength({ min: 3 })
      .withMessage("Please provide a model with at least 3 characters."),
    body("inv_year")
      .isInt({ min: 1900, max: 9999 })
      .withMessage("Please provide a valid year."),
    body("inv_price")
      .isFloat({ min: 0 })
      .withMessage("Please provide a valid price."),
  ]
}

/* ***************************
 *  Check data and return errors
 * ************************** */
validate.checkInventoryData = async (req, res, next) => {
  const {
    classification_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
  } = req.body

  let errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    const classificationSelect = await utilities.buildClassificationList(classification_id)
    res.render("inventory/add-inventory", {
      errors,
      title: "Add New Vehicle",
      nav,
      classificationSelect,
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      classification_id,
    })
    return
  }
  next()
}
/* ***************************
 *  Check update data and return errors
 * ************************** */
validate.checkUpdateData = async (req, res, next) => {
  const {
    inv_id,
    classification_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
  } = req.body

  let errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    const classificationSelect = await utilities.buildClassificationList(classification_id)
    res.render("inventory/edit-inventory", {
      errors,
      title: "Edit " + inv_make + " " + inv_model,
      nav,
      classificationSelect,
      inv_id,
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      classification_id,
    })
    return
  }
  next()
}

module.exports = validate
