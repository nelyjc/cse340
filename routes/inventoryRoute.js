/* ******************************************
 routes/inventoryRoute.js
 *******************************************/
const express = require("express")
const router = express.Router()
const utilities = require("../utilities/")
const invCont = require("../controllers/invController.js")
const invValidate = require("../utilities/inventory-validation.js")
const authorize = require("../utilities/authorize.js")

/* ******************************************
 * Public Routes (No authorization required)
 *******************************************/

// Build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invCont.buildByClassificationId))

// Build single vehicle detail view
router.get("/detail/:invId", utilities.handleErrors(invCont.buildInventoryDetail))

// Get inventory items as JSON (used for dynamic dropdowns, etc.)
router.get("/getInventory/:classification_id", utilities.handleErrors(invCont.getInventoryJSON))

/* ******************************************
 * Admin Routes (Employee/Admin only)
 *******************************************/

// Inventory management view
router.get("/", authorize.checkInventoryAccess, utilities.handleErrors(invCont.buildManagementView))

// Add-classification
router.get("/add-classification", authorize.checkInventoryAccess, utilities.handleErrors(invCont.buildAddClassification))
router.post(
  "/add-classification",
  authorize.checkInventoryAccess,
  utilities.classificationValidator,
  utilities.handleErrors(invCont.addClassification)
)

// Add-inventory
router.get("/add-inventory", authorize.checkInventoryAccess, utilities.handleErrors(invCont.buildAddInventory))
router.post("/add-inventory", authorize.checkInventoryAccess, invCont.addInventory)

// Edit inventory
router.get("/edit/:inv_id", authorize.checkInventoryAccess, utilities.handleErrors(invCont.editInventoryView))
router.post(
  "/edit/:inv_id",
  authorize.checkInventoryAccess,
  invValidate.newInventoryRules(),
  invValidate.checkUpdateData,
  invCont.updateInventory
)

// Delete inventory
router.get("/delete/:inv_id", authorize.checkInventoryAccess, utilities.handleErrors(invCont.buildDeleteConfirm))
router.post("/delete", authorize.checkInventoryAccess, invCont.deleteInventoryItem)

/* ******************************************
 * Error Testing Route
 *******************************************/

// Intentional 500 error for testing
router.get("/throw-error", utilities.handleErrors(async (req, res, next) => {
  throw new Error("This is an intentional 500 error for testing")
}))

module.exports = router
