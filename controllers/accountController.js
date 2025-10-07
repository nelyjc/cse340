// controllers/accountController.js

const utilities = require("../utilities")
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ****************************************
 * Deliver login view
 **************************************** */
async function buildLogin(req, res, next) {
  try {
    const nav = await utilities.getNav()
    res.render("account/login", {
      title: "Login",
      nav,
      account_email: "",
      errors: req.flash("notice"),
    })
  } catch (error) {
    next(error)
  }
}

/* ****************************************
 * Deliver registration view
 **************************************** */
async function buildRegister(req, res, next) {
  try {
    let nav = await utilities.getNav()
    console.log("Nav built successfully:", nav)
    res.render("account/register", {
      title: "Register",
      nav,
      errors: null
    })
  } catch (error) {
    console.error("buildRegister error:", error)
    next(error)
  }
}

/* ****************************************
 * Process Registration
 **************************************** */
async function registerAccount(req, res, next) {
  try {
    const nav = await utilities.getNav()
    const { account_firstname, account_lastname, account_email, account_password } = req.body

    // Save plain text password for now
    const regResult = await accountModel.registerAccount(
      account_firstname,
      account_lastname,
      account_email,
      account_password
    )

    if (regResult) {
      req.flash("success", `🎉 Registration successful, ${account_firstname}! Please log in.`)
      return res.redirect("/account/login")
    } else {
      req.flash("notice", "Registration failed. Try again.")
      return res.redirect("/account/register")
    }
  } catch (error) {
    console.error("Registration error:", error)
    req.flash("notice", "Something went wrong during registration.")
    return res.redirect("/account/register")
  }
}

/* ****************************************
 * Process Login
 **************************************** */
async function accountLogin(req, res, next) {
  try {
    const nav = await utilities.getNav()
    const { account_email, account_password } = req.body
    const accountData = await accountModel.getAccountByEmail(account_email)

    if (!accountData || account_password !== accountData.account_password) {
      req.flash("notice", "Invalid email or password.")
      return res.redirect("/account/login")
    }

    // Set session info
    req.session.loggedin = true
    req.session.accountData = accountData

    // JWT for API or extra security (optional)
    const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
    res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })

    req.flash("success", `Welcome back, ${accountData.account_firstname}!`)
    return res.redirect("/account/")
  } catch (error) {
    next(error)
  }
}

/* ****************************************
 * Account Management View
 **************************************** */
async function accountManagement(req, res, next) {
  try {
    const nav = await utilities.getNav()
    const accountData = req.session.accountData || {}
    const loggedin = req.session.loggedin || false

    res.render("account/manage", {
      title: "Account Management",
      nav,
      loggedin,
      accountData,
      messages: req.flash("success"),
    })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  buildLogin,
  buildRegister,
  registerAccount,
  accountLogin,
  accountManagement,
}
