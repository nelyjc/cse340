// controllers/accountController.js
const accountModel = require("../models/account-model")
const utilities = require("../utilities")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const { validationResult } = require("express-validator")
require("dotenv").config()

/* ****************************************
 * Build login page
 ****************************************/
async function buildLogin(req, res) {
  const nav = await utilities.getNav()
  res.render("account/login", {
    title: "Login",
    nav,
    account_email: "",
    errors: req.flash("notice")
  })
}

/* ****************************************
 * Build register page
 ****************************************/
async function buildRegister(req, res) {
  const nav = await utilities.getNav()
  res.render("account/register", {
    title: "Register",
    nav,
    errors: req.flash("notice")
  })
}

/* ****************************************
 * Process registration
 ****************************************/
async function registerAccount(req, res) {
  const { account_firstname, account_lastname, account_email, account_password } = req.body
  const nav = await utilities.getNav()
  const result = await accountModel.registerAccount(account_firstname, account_lastname, account_email, account_password)
  if (result) {
    req.flash("success", "Registration successful. Please log in.")
    return res.redirect("login")
  } else {
    req.flash("notice", "Registration failed.")
    return res.redirect("register")
  }
}

/* ****************************************
 * Process login
 ****************************************/
async function accountLogin(req, res) {
  const { account_email, account_password } = req.body
  const nav = await utilities.getNav()
  const accountData = await accountModel.getAccountByEmail(account_email)

  if (!accountData || account_password !== accountData.account_password) {
    req.flash("notice", "Invalid email or password.")
    return res.redirect("login")
  }

  // Set session and JWT
  req.session.loggedin = true
  req.session.accountData = accountData
  const token = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
  res.cookie("jwt", token, { httpOnly: true, maxAge: 3600 * 1000 })

  req.flash("success", `Welcome back, ${accountData.account_firstname}!`)
  return res.redirect("management")
}

/* ****************************************
 * Account Management
 ****************************************/
async function accountManagement(req, res) {
  const nav = await utilities.getNav()
  const account = res.locals.account // set by checkJWTToken

  res.render("account/management", {
    title: "Account Management",
    nav,
    loggedin: !!account,
    account
  })
}

/* ****************************************
 * Build account update page
 ****************************************/
async function buildAccountUpdateView(req, res) {
  const account_id = req.params.account_id
  const account = await accountModel.getAccountById(account_id)
  const nav = await utilities.getNav()
  res.render("account/update", { title: "Update Account", nav, account, errors: [], flashMessage: null })
}

/* ****************************************
 * Update account info
 ****************************************/
async function updateAccount(req, res) {
  const errors = validationResult(req)
  const account = req.body
  const nav = await utilities.getNav()
  if (!errors.isEmpty()) {
    return res.render("account/update", { title: "Update Account", nav, account, errors: errors.array(), flashMessage: null })
  }

  const result = await accountModel.updateAccountInfo(account)
  const updatedAccount = await accountModel.getAccountById(account.account_id)
  res.render("account/management", { title: "Account Management", nav, account: updatedAccount, flashMessage: result ? "Account updated!" : "Update failed.", errors: [] })
}

/* ****************************************
 * Update password
 ****************************************/
async function updatePassword(req, res) {
  const errors = validationResult(req)
  const account = req.body
  const nav = await utilities.getNav()
  if (!errors.isEmpty()) {
    return res.render("account/update", { title: "Update Account", nav, account, errors: errors.array(), flashMessage: null })
  }

  const hashed = await bcrypt.hash(account.account_password, 10)
  const result = await accountModel.updateAccountPassword(account.account_id, hashed)
  const updatedAccount = await accountModel.getAccountById(account.account_id)
  res.render("account/management", { title: "Account Management", nav, account: updatedAccount, flashMessage: result ? "Password updated!" : "Password update failed.", errors: [] })
}

module.exports = {
  buildLogin,
  buildRegister,
  registerAccount,
  accountLogin,
  accountManagement,
  buildAccountUpdateView,
  updateAccount,
  updatePassword
}
//this worked at one time until it did not
//considering how much time was spent on this, I am leaving it here for reference//

// // controllers/accountController.js

// const utilities = require("../utilities")
// const accountModel = require("../models/account-model")
// const bcrypt = require("bcryptjs")
// const { validationResult } = require("express-validator")
// const jwt = require("jsonwebtoken")
// require("dotenv").config()

// /* ****************************************
//  * Deliver login view
//  **************************************** */
// async function buildLogin(req, res, next) {
//   try {
//     const nav = await utilities.getNav()
//     res.render("login", {
//       title: "Login",
//       nav,
//       account_email: "",
//       errors: req.flash("notice"),
//     })
//   } catch (error) {
//     next(error)
//   }
// }

// /* ****************************************
//  * Deliver registration view
//  **************************************** */
// async function buildRegister(req, res, next) {
//   try {
//     let nav = await utilities.getNav()
//     console.log("Nav built successfully:", nav)
//     res.render("register", {
//       title: "Register",
//       nav,
//       errors: null
//     })
//   } catch (error) {
//     console.error("buildRegister error:", error)
//     next(error)
//   }
// }

// /* ****************************************
//  * Process Registration
//  **************************************** */
// async function registerAccount(req, res, next) {
//   try {
//     const nav = await utilities.getNav()
//     const { account_firstname, account_lastname, account_email, account_password } = req.body

//     // Save plain text password for now
//     const regResult = await accountModel.registerAccount(
//       account_firstname,
//       account_lastname,
//       account_email,
//       account_password
//     )

//     if (regResult) {
//       req.flash("success", `🎉 Registration successful, ${account_firstname}! Please log in.`)
//       return res.redirect("login")
//     } else {
//       req.flash("notice", "Registration failed. Try again.")
//       return res.redirect("register")
//     }
//   } catch (error) {
//     console.error("Registration error:", error)
//     req.flash("notice", "Something went wrong during registration.")
//     return res.redirect("register")
//   }
// }

// /* ****************************************
//  * Process Login
//  **************************************** */
// async function accountLogin(req, res, next) {
//   try {
//     const nav = await utilities.getNav()
//     const { account_email, account_password } = req.body
//     const accountData = await accountModel.getAccountByEmail(account_email)

//     if (!accountData || account_password !== accountData.account_password) {
//       req.flash("notice", "Invalid email or password.")
//       return res.redirect("login")
//     }

//     // Set session info
//     req.session.loggedin = true
//     req.session.accountData = accountData

//     // JWT for API or extra security (optional)
//     const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
//     res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })

//     req.flash("success", `Welcome back, ${accountData.account_firstname}!`)
//     return res.redirect("management")
//   } catch (error) {
//     next(error)
//   }
// }

// /* ****************************************
//  * Account Management View
//  **************************************** */
// async function accountManagement(req, res, next) {
//   try {
//     const nav = await utilities.getNav();

//     // Get account info from JWT/session middleware
//     const account = res.locals.account; 

//     res.render("management", {
//       title: "Account Management",
//       nav,
//       loggedin: !!account,
//       account, 
//     });
//   } catch (error) {
//     next(error);
//   }
// }



// /* Render the account update view */
// async function buildAccountUpdateView(req, res, next) {
//   try {
//     const account_id = parseInt(req.params.account_id)
//     const account = await accountModel.getAccountById(account_id)
//     const nav = await utilities.getNav()
//     res.render('update', {
//       title: 'Update Account',
//       nav,
//       account,
//       errors: [],
//       flashMessage: null
//     })
//   } catch (error) {
//     next(error)
//   }
// }

// /* Handle account info update */
// async function updateAccount(req, res, next) {
//   const errors = validationResult(req)
//   const account = req.body
//   const nav = await utilities.getNav()

//   if (!errors.isEmpty()) {
//     return res.render('update', {
//       title: 'Update Account',
//       nav,
//       account,
//       errors: errors.array(),
//       flashMessage: null
//     })
//   }

//   try {
//     const result = await accountModel.updateAccountInfo(account)
//     if (result) {
//       const updatedAccount = await accountModel.getAccountById(account.account_id)
//       res.render('management', {
//         title: 'Account Management',
//         nav,
//         account: updatedAccount,
//         flashMessage: 'Account information updated successfully!',
//         errors: []
//       })
//     } else {
//       res.render('update', {
//         title: 'Update Account',
//         nav,
//         account,
//         errors: [],
//         flashMessage: 'Failed to update account information.'
//       })
//     }
//   } catch (error) {
//     next(error)
//   }
// }

// /* Handle password change */
// async function updatePassword(req, res, next) {
//   const errors = validationResult(req)
//   const account = req.body
//   const nav = await utilities.getNav()

//   if (!errors.isEmpty()) {
//     return res.render('update', {
//       title: 'Update Account',
//       nav,
//       account,
//       errors: errors.array(),
//       flashMessage: null
//     })
//   }

//   try {
//     const hashedPassword = await bcrypt.hash(account.account_password, 10)
//     const result = await accountModel.updateAccountPassword(account.account_id, hashedPassword)

//     const updatedAccount = await accountModel.getAccountById(account.account_id)

//     res.render('management', {
//       title: 'Account Management',
//       nav,
//       account: updatedAccount,
//       flashMessage: result ? 'Password updated successfully!' : 'Failed to update password.',
//       errors: []
//     })
//   } catch (error) {
//     next(error)
//   }
// }


// module.exports = {
//   buildLogin,
//   buildRegister,
//   registerAccount,
//   accountLogin,
//   accountManagement,  
//   buildAccountUpdateView,
//   updateAccount,
//   updatePassword
// }
// // controllers/accountController.js another try that did not work but is left for reference//

// const utilities = require("../utilities")
// const accountModel = require("../models/account-model")
// const bcrypt = require("bcryptjs")
// const { validationResult } = require("express-validator")
// const jwt = require("jsonwebtoken")
// require("dotenv").config()

// /* Render login page */
// async function buildLogin(req, res, next) {
//   try {
//     const nav = await utilities.getNav()
//     res.render("account/login", {
//       title: "Login",
//       nav,
//       account_email: "",
//       errors: req.flash("notice"),
//     })
//   } catch (error) {
//     next(error)
//   }
// }

// /* Render registration page */
// async function buildRegister(req, res, next) {
//   try {
//     const nav = await utilities.getNav()
//     res.render("account/register", {
//       title: "Register",
//       nav,
//       errors: null
//     })
//   } catch (error) {
//     next(error)
//   }
// }

// /* Handle registration */
// async function registerAccount(req, res, next) {
//   try {
//     const { account_firstname, account_lastname, account_email, account_password } = req.body
//     const result = await accountModel.registerAccount(
//       account_firstname, account_lastname, account_email, account_password
//     )

//     if (result) {
//       req.flash("success", `🎉 Registration successful, ${account_firstname}! Please log in.`)
//       return res.redirect("/account/login")
//     }

//     req.flash("notice", "Registration failed.")
//     res.redirect("/account/register")
//   } catch (error) {
//     console.error(error)
//     req.flash("notice", "Registration error.")
//     res.redirect("/account/register")
//   }
// }

// /* Handle login */
// async function accountLogin(req, res, next) {
//   try {
//     const { account_email, account_password } = req.body
//     const accountData = await accountModel.getAccountByEmail(account_email)

//     if (!accountData || account_password !== accountData.account_password) {
//       req.flash("notice", "Invalid email or password.")
//       return res.redirect("/account/login")
//     }

//     // Create JWT
//     const token = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' })
//     res.cookie("jwt", token, { httpOnly: true, maxAge: 3600000 })

//     req.flash("success", `Welcome back, ${accountData.account_firstname}!`)
//     res.redirect("/account/management")
//   } catch (error) {
//     next(error)
//   }
// }

// /* Account management view */
// async function accountManagement(req, res, next) {
//   try {
//     const nav = await utilities.getNav()
//     const account = res.locals.account
//     res.render("account/management", {
//       title: "Account Management",
//       nav,
//       loggedin: !!account,
//       account,
//     })
//   } catch (error) {
//     next(error)
//   }
// }

// /* Account update view */
// async function buildAccountUpdateView(req, res, next) {
//   try {
//     const account_id = parseInt(req.params.account_id);
//     const account = await accountModel.getAccountById(account_id);
//     res.render("account/update", {
//       title: "Update Account",
//       account,
//       loggedin: !!account,
//     });
//   } catch (error) {
//     next(error);
//   }
// }


// /* Update account info */
// async function updateAccount(req, res, next) {
//   const errors = validationResult(req)
//   const account = req.body
//   const nav = await utilities.getNav()

//   if (!errors.isEmpty()) {
//     return res.render("account/update", { title: "Update Account", nav, account, errors: errors.array(), flashMessage: null })
//   }

//   try {
//     await accountModel.updateAccountInfo(account)
//     const updatedAccount = await accountModel.getAccountById(account.account_id)

//     res.render("account/management", {
//       title: "Account Management",
//       nav,
//       account: updatedAccount,
//       flashMessage: "Account updated successfully!",
//       errors: []
//     })
//   } catch (error) {
//     next(error)
//   }
// }

// /* Change password */
// async function updatePassword(req, res, next) {
//   const errors = validationResult(req)
//   const account = req.body
//   const nav = await utilities.getNav()

//   if (!errors.isEmpty()) {
//     return res.render("account/update", { title: "Update Account", nav, account, errors: errors.array(), flashMessage: null })
//   }

//   try {
//     const hashedPassword = await bcrypt.hash(account.account_password, 10)
//     await accountModel.updateAccountPassword(account.account_id, hashedPassword)

//     const updatedAccount = await accountModel.getAccountById(account.account_id)

//     res.render("account/management", {
//       title: "Account Management",
//       nav,
//       account: updatedAccount,
//       flashMessage: "Password updated successfully!",
//       errors: []
//     })
//   } catch (error) {
//     next(error)
//   }
// }

// /* Logout */
// function logout(req, res) {
//   res.clearCookie("jwt")
//   if (req.session) {
//     req.session.destroy(() => res.redirect("/"))
//   } else {
//     res.redirect("/")
//   }
// }

// module.exports = {
//   buildLogin,
//   buildRegister,
//   registerAccount,
//   accountLogin,
//   accountManagement,
//   buildAccountUpdateView,
//   updateAccount,
//   updatePassword,
//   logout
// }
// // // // // const accountModel = require("../models/account-model");
// // // // // const utilities = require("../utilities");
// // // // // const { validationResult } = require("express-validator");
// // // // // const bcrypt = require("bcryptjs");
// // // // // const jwt = require("jsonwebtoken");
// // // // // require("dotenv").config();

// // // // // // Login view
// // // // // async function buildLogin(req, res) {
// // // // //   const nav = await utilities.getNav();
// // // // //   res.render("account/login", { title: "Login", nav, errors: req.flash("notice") });
// // // // // }

// // // // // // Register view
// // // // // async function buildRegister(req, res) {
// // // // //   res.render("account/register", {
// // // // //     title: "Register",
// // // // //     errors: [], // <- must be an array, not null
// // // // //   })
// // // // // }
// // // // // // Process registration
// // // // // async function registerAccount(req, res) {
// // // // //   const { account_firstname, account_lastname, account_email, account_password } = req.body;
// // // // // }

// // // // // // Process login
// // // // // async function accountLogin(req, res) {
// // // // //   const nav = await utilities.getNav();
// // // // //   const { account_email, account_password } = req.body;
// // // // //   const accountData = await accountModel.getAccountByEmail(account_email);

// // // // //   if (!accountData || account_password !== accountData.account_password) {
// // // // //     req.flash("notice", "Invalid email or password");
// // // // //     return res.redirect("/account/login");
// // // // //   }

// // // // //   // JWT
// // // // //   const token = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1h" });
// // // // //   res.cookie("jwt", token, { httpOnly: true, maxAge: 3600000 });

// // // // //   req.flash("success", `Welcome back, ${accountData.account_firstname}!`);
// // // // //   res.redirect("/account/management");
// // // // // }

// // // // // // Account Management view
// // // // // async function accountManagement(req, res) {
// // // // //   const nav = await utilities.getNav();
// // // // //   const account = res.locals.account;
// // // // //   res.render("account/management", { title: "Account Management", nav, loggedin: !!account, account });
// // // // // }

// // // // // // Update Account view
// // // // // async function buildAccountUpdateView(req, res) {
// // // // //   const account_id = parseInt(req.params.account_id);
// // // // //   const account = await accountModel.getAccountById(account_id);
// // // // //   const nav = await utilities.getNav();
// // // // //   res.render("account/update", { title: "Update Account", nav, account, loggedin: true });
// // // // // }

// // // // // // Handle account update
// // // // // async function updateAccount(req, res) {
// // // // //   const errors = validationResult(req);
// // // // //   const account = req.body;
// // // // //   const nav = await utilities.getNav();

// // // // //   if (!errors.isEmpty()) {
// // // // //     return res.render("account/update", { title: "Update Account", nav, account, errors: errors.array(), loggedin: true });
// // // // //   }

// // // // //   await accountModel.updateAccountInfo(account);
// // // // //   const updatedAccount = await accountModel.getAccountById(account.account_id);
// // // // //   res.redirect("/account/management");
// // // // // }

// // // // // // Change Password
// // // // // async function updatePassword(req, res) {
// // // // //   const errors = validationResult(req);
// // // // //   if (!errors.isEmpty()) return res.redirect("/account/management");

// // // // //   const hashedPassword = await bcrypt.hash(req.body.account_password, 10);
// // // // //   await accountModel.updateAccountPassword(req.body.account_id, hashedPassword);
// // // // //   res.redirect("/account/management");
// // // // // }

// // // // // module.exports = {
// // // // //   buildLogin,
// // // // //   buildRegister,
// // // // //   accountLogin,
// // // // //   accountManagement,
// // // // //   buildAccountUpdateView,
// // // // //   updateAccount,
// // // // //   updatePassword
// // // // // };
