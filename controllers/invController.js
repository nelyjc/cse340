/* controllers/invController.js */
const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

/* ***************************
 *  Build vehicle detail view
 * ************************** */
invCont.buildInventoryDetail = async function (req, res, next) {
  try {
    const invId = req.params.invId
    const vehicle = await invModel.getInventoryById(invId) // single object

    if (!vehicle) {
      return res.status(404).render("errors/404", { message: "Vehicle not found" })
    }

    const nav = await utilities.getNav()
    const vehicleDetailHTML = await utilities.buildVehicleDetailHTML(vehicle)

    res.render("./inventory/detail", {
      title: `${vehicle.inv_make} ${vehicle.inv_model}`,
      nav,
      vehicleDetailHTML
    })
  } catch (error) {
    console.error("buildInventoryDetail error:", error)
    res.status(500).render("errors/500", { message: "Server error" })
  }
}


module.exports = invCont