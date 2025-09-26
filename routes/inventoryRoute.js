/* routes/inventoryRoute.js */
// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController.js")
const utilities = require("../utilities/")

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId))

// Route to build single vehicle detail view   
router.get("/detail/:invId", utilities.handleErrors(invController.buildInventoryDetail))

module.exports = router

// Intentional 500 error route
router.get("/throw-error", utilities.handleErrors(async (req, res, next) => {
  throw new Error("This is an intentional 500 error for testing")
}))
// To test the 500 error handling, navigate to /inv/throw-error in browser */