const jwt = require("jsonwebtoken")
require("dotenv").config()
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")
const utilities = require("../utilities")

/* ****************************************
 * Process login request
 **************************************** */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)

  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    return res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    })
  }

  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 })
      res.cookie("jwt", accessToken, {
        httpOnly: true,
        ...(process.env.NODE_ENV === 'production' ? { secure: true } : {}),
        maxAge: 3600 * 1000
      })
      return res.redirect("/account")
    } else {
      req.flash("notice", "Please check your credentials and try again.")
      return res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      })
    }
  } catch (error) {
    throw new Error('Access Forbidden')
  }
}

/* ****************************************
 * Account home view
 **************************************** */
async function accountHome(req, res) {
  let nav = await utilities.getNav()
  res.render("account/account-home", {
    title: "You're logged in",
    nav,
    loggedin: res.locals.loggedin || 0,
    accountData: res.locals.accountData || null,
    errors: null
  })
}

module.exports = {
  accountLogin,
  accountHome,
  buildLogin: async (req, res) => {
    let nav = await utilities.getNav()
    res.render("account/login", { title: "Login", nav, errors: null })
  },
  buildRegister: async (req, res) => {
    let nav = await utilities.getNav()
    res.render("account/register", { title: "Register", nav, errors: null })
  },
  registerAccount: async (req, res) => {
    // your existing registration function here
  }
}
