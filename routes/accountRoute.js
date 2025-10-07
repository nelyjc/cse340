const express = require("express")
const router = new express.Router()
const utilities = require("../utilities")
const accountController = require("../controllers/accountController")
const regValidate = require('../utilities/account-validation')

// Default account route (after login)
router.get("/", utilities.handleErrors(accountController.accountHome))

// Login view
router.get("/login", utilities.handleErrors(accountController.buildLogin))

// Process login request
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
)

// Registration view
router.get("/register", utilities.handleErrors(accountController.buildRegister))

// Process registration request
router.post(
  "/register",
  regValidate.registrationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
)

module.exports = router
// Export the router