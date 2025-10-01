/* ******************************************
 routes/inventoryRoute.js
 *******************************************/
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController.js")
const utilities = require("../utilities/")

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId))

// Route to build single vehicle detail view   
router.get("/detail/:invId", utilities.handleErrors(invController.buildInventoryDetail))

// Management view
router.get("/", utilities.handleErrors(invController.buildManagement))

// Render add-classification form
router.get("/add-classification", utilities.handleErrors(invController.buildAddClassification))

// Handle form submission
router.post(
  "/add-classification", 
    utilities.classificationValidator,  // server-side validation middleware
    utilities.handleErrors(invController.addClassification)
)
// Render add-inventory form
router.get("/add-inventory", invController.buildAddInventory)
router.post("/add-inventory", invController.addInventory)


module.exports = router

// Intentional 500 error route
router.get("/throw-error", utilities.handleErrors(async (req, res, next) => {
  throw new Error("This is an intentional 500 error for testing")
}))
// To test the 500 error handling, navigate to /inv/throw-error in browser */