const express = require("express")
const router = new express.Router()
const utilities = require("../utilities")
const accountController = require("../controllers/accountController")
const regValidate = require('../utilities/account-validation')

// Default account route (after login)
router.get("/", utilities.handleErrors(accountController.accountManagement));
router.get("/management", utilities.handleErrors(accountController.accountManagement));


// Login view
// Process login request
router.get("/login", utilities.handleErrors(accountController.buildLogin))
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
)

// Registration view
// Process registration request
router.get("/register", utilities.handleErrors(accountController.buildRegister))
router.post(
  "/register",
  regValidate.registrationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
)

// Account update view
// router.get("/edit", utilities.handleErrors(accountController.buildEdit));

module.exports = router
// Export the router