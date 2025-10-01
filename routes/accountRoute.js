// Account routes for login and registration//
const express = require("express")
const router = new express.Router()
const utilities = require("../utilities")
const accountController = require("../controllers/accountController")
const regValidate = require('../utilities/account-validation')

// Route for "My Account" link
router.get("/", utilities.handleErrors(accountController.buildLogin))

// Login view
router.get("/login", utilities.handleErrors(accountController.buildLogin))

// Registration view
router.get("/register", utilities.handleErrors(accountController.buildRegister))

// Register new account//
// Process the registration data//
router.post(
  "/register",
  regValidate.registationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
)

module.exports = router
