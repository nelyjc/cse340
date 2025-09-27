const express = require("express")
const router = new express.Router()
const utilities = require("../utilities")
const accountController = require("../controllers/accountController")

// Route for "My Account" link
router.get("/", utilities.handleErrors(accountController.buildLogin))

// Login view
router.get("/login", utilities.handleErrors(accountController.buildLogin))

// Registration view
router.get("/register", utilities.handleErrors(accountController.buildRegister))

// Register new account
router.post("/register", utilities.handleErrors(accountController.registerAccount))

module.exports = router
