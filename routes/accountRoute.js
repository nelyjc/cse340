// // // routes/accountRoute.js//this worked at one time until it did not
//considering how much time was spent on this, I am leaving it here for reference//

// // const express = require("express")
// // const router = express.Router()
// // const { body } = require("express-validator")

// // const utilities = require("../utilities")
// // const accountController = require("../controllers/accountController")
// // const regValidate = require("../utilities/account-validation")
// // const authorize = require("../utilities/authorize")

// // /* ****************************************
// //  * Account Management (default after login)
// //  **************************************** */
// // router.get(
// //   "management",
// //   authorize.checkJWTToken,
// //   utilities.handleErrors(accountController.accountManagement)
// // )

// // /* ****************************************
// //  * Login
// //  **************************************** */
// // router.get("login", utilities.handleErrors(accountController.buildLogin))
// // router.post(
// //   "login",
// //   regValidate.loginRules(),
// //   regValidate.checkLoginData,
// //   utilities.handleErrors(accountController.accountLogin)
// // )

// // /* ****************************************
// //  * Registration
// //  **************************************** */
// // router.get("register", utilities.handleErrors(accountController.buildRegister))
// // router.post(
// //   "register",
// //   regValidate.registrationRules(),
// //   regValidate.checkRegData,
// //   utilities.handleErrors(accountController.registerAccount)
// // )

// // /* ****************************************
// //  * Update Account
// //  **************************************** */
// // router.get(
// //   "update/:account_id",
// //   utilities.handleErrors(accountController.buildAccountUpdateView)
// // )
// // router.post(
// //   "update",
// //   [
// //     body("account_firstname").trim().notEmpty().withMessage("First name is required"),
// //     body("account_lastname").trim().notEmpty().withMessage("Last name is required"),
// //     body("account_email").trim().isEmail().withMessage("Valid email is required"),
// //   ],
// //   utilities.handleErrors(accountController.updateAccount)
// // )

// // /* ****************************************
// //  * Change Password
// //  **************************************** */
// // router.post(
// //   "change-password",
// //   [
// //     body("account_password")
// //       .trim()
// //       .notEmpty()
// //       .isStrongPassword({
// //         minLength: 12,
// //         minLowercase: 1,
// //         minUppercase: 1,
// //         minNumbers: 1,
// //         minSymbols: 1,
// //       })
// //       .withMessage("Password must meet requirements"),
// //   ],
// //   utilities.handleErrors(accountController.updatePassword)
// // )

// // /* ****************************************
// //  * Logout
// //  **************************************** */
// // router.get("logout", (req, res) => {
// //   res.clearCookie("jwt") // Clear JWT cookie
// //   if (req.session) {
// //     req.session.destroy(() => {
// //       res.redirect("/") // Redirect to home
// //     })
// //   } else {
// //     res.redirect("/")
// //   }
// // })

// // /* ****************************************
// //  * Export router
// //  **************************************** */
// // module.exports = router
// // const express = require("express")
// // const router = express.Router()
// // const { body } = require("express-validator")

// // const accountController = require("../controllers/accountController")
// // const regValidate = require("../utilities/account-validation")
// // const authorize = require("../utilities/authorize")
// // const utilities = require("../utilities")

// // /* ***************************************
// //  * Default /account route
// //  * Redirects to management if logged in
// //  ***************************************/
// // router.get("/", authorize.checkJWTToken, (req, res) => {
// //   if (res.locals.loggedin) {
// //     return res.redirect("management") // relative redirect
// //   } else {
// //     return res.redirect("login")
// //   }
// // })

// // /* ***************************************
// //  * Account Management
// //  ***************************************/
// // router.get(
// //   "/management",
// //   authorize.checkJWTToken,
// //   utilities.handleErrors(accountController.accountManagement)
// // )

// // /* ***************************************
// //  * Login
// //  ***************************************/
// // router.get("/login", utilities.handleErrors(accountController.buildLogin))
// // router.post(
// //   "/login",
// //   regValidate.loginRules(),
// //   regValidate.checkLoginData,
// //   utilities.handleErrors(accountController.accountLogin)
// // )

// // /* ***************************************
// //  * Registration
// //  ***************************************/
// // router.get("/register", utilities.handleErrors(accountController.buildRegister))
// // router.post(
// //   "/register",
// //   regValidate.registrationRules(),
// //   regValidate.checkRegData,
// //   utilities.handleErrors(accountController.registerAccount)
// // )

// // /* ***************************************
// //  * Update Account
// //  ***************************************/
// // router.get(
// //   "/update/:account_id",
// //   utilities.handleErrors(accountController.buildAccountUpdateView)
// // )
// // router.post(
// //   "/update",
// //   [
// //     body("account_firstname").trim().notEmpty().withMessage("First name is required"),
// //     body("account_lastname").trim().notEmpty().withMessage("Last name is required"),
// //     body("account_email").trim().isEmail().withMessage("Valid email is required"),
// //   ],
// //   utilities.handleErrors(accountController.updateAccount)
// // )

// // /* ***************************************
// //  * Change Password
// //  ***************************************/
// // router.post(
// //   "/change-password",
// //   [
// //     body("account_password")
// //       .trim()
// //       .notEmpty()
// //       .isStrongPassword({ minLength: 12, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 })
// //       .withMessage("Password must meet requirements"),
// //   ],
// //   utilities.handleErrors(accountController.updatePassword)
// // )

// // /* ***************************************
// //  * Logout
// //  ***************************************/
// // router.get("/logout", (req, res) => {
// //   res.clearCookie("jwt")
// //   if (req.session) req.session.destroy(() => res.redirect("/"))
// //   else res.redirect("/")
// // })

// // module.exports = router
// const express = require("express")
// const router = express.Router()
// const { body } = require("express-validator")
// const accountController = require("../controllers/accountController")
// const utilities = require("../utilities")
// const regValidate = require("../utilities/account-validation")
// const authorize = require("../utilities/authorize")

// /* Default /account route */
// router.get("/", authorize.checkJWTToken, (req, res) => {
//   if (res.locals.loggedin) return res.redirect("/account/management")
//   res.redirect("/account/login")
// })

// /* Account Management */
// router.get("/management", authorize.checkJWTToken, utilities.handleErrors(accountController.accountManagement))

// /* Login */
// router.get("/login", utilities.handleErrors(accountController.buildLogin))
// router.post("/login", regValidate.loginRules(), regValidate.checkLoginData, utilities.handleErrors(accountController.accountLogin))

// /* Register */
// router.get("/register", utilities.handleErrors(accountController.buildRegister))
// router.post("/register", regValidate.registrationRules(), regValidate.checkRegData, utilities.handleErrors(accountController.registerAccount))

// /* Update Account */
// router.get("/update/:account_id", utilities.handleErrors(accountController.buildAccountUpdateView))
// router.post("/update", [
//   body("account_firstname").trim().notEmpty().withMessage("First name is required"),
//   body("account_lastname").trim().notEmpty().withMessage("Last name is required"),
//   body("account_email").trim().isEmail().withMessage("Valid email is required")
// ], utilities.handleErrors(accountController.updateAccount))

// /* Change Password */
// router.post("/change-password", [
//   body("account_password").trim().isStrongPassword({
//     minLength: 12, minLowercase:1, minUppercase:1, minNumbers:1, minSymbols:1
//   }).withMessage("Password must meet requirements")
// ], utilities.handleErrors(accountController.updatePassword))

// /* Logout */
// router.get("/logout", (req, res) => {
//   res.clearCookie("jwt");       // Remove JWT cookie
//   if (req.session) {
//     req.session.destroy(() => { // Destroy server session
//       res.redirect("/");        // Send user to home
//     });
//   } else {
//     res.redirect("/");          // Just redirect if no session
//   }
// });


// module.exports = router
// // routes/accountRoute.js
// const express = require("express")
// const router = express.Router()
// const { body } = require("express-validator")

// const utilities = require("../utilities")
// const accountController = require("../controllers/accountController")
// const regValidate = require("../utilities/account-validation")
// const authorize = require("../utilities/authorize")

// /* ****************************************
//  * Account Management (default after login)
//  **************************************** */
// router.get(
//   "management",
//   authorize.checkJWTToken,
//   utilities.handleErrors(accountController.accountManagement)
// )

// /* ****************************************
//  * Login
//  **************************************** */
// router.get("login", utilities.handleErrors(accountController.buildLogin))
// router.post(
//   "login",
//   regValidate.loginRules(),
//   regValidate.checkLoginData,
//   utilities.handleErrors(accountController.accountLogin)
// )

// /* ****************************************
//  * Registration
//  **************************************** */
// router.get("register", utilities.handleErrors(accountController.buildRegister))
// router.post(
//   "register",
//   regValidate.registrationRules(),
//   regValidate.checkRegData,
//   utilities.handleErrors(accountController.registerAccount)
// )

// /* ****************************************
//  * Update Account
//  **************************************** */
// router.get(
//   "update/:account_id",
//   utilities.handleErrors(accountController.buildAccountUpdateView)
// )
// router.post(
//   "update",
//   [
//     body("account_firstname").trim().notEmpty().withMessage("First name is required"),
//     body("account_lastname").trim().notEmpty().withMessage("Last name is required"),
//     body("account_email").trim().isEmail().withMessage("Valid email is required"),
//   ],
//   utilities.handleErrors(accountController.updateAccount)
// )

// /* ****************************************
//  * Change Password
//  **************************************** */
// router.post(
//   "change-password",
//   [
//     body("account_password")
//       .trim()
//       .notEmpty()
//       .isStrongPassword({
//         minLength: 12,
//         minLowercase: 1,
//         minUppercase: 1,
//         minNumbers: 1,
//         minSymbols: 1,
//       })
//       .withMessage("Password must meet requirements"),
//   ],
//   utilities.handleErrors(accountController.updatePassword)
// )

// /* ****************************************
//  * Logout
//  **************************************** */
// router.get("logout", (req, res) => {
//   res.clearCookie("jwt") // Clear JWT cookie
//   if (req.session) {
//     req.session.destroy(() => {
//       res.redirect("/") // Redirect to home
//     })
//   } else {
//     res.redirect("/")
//   }
// })

// /* ****************************************
//  * Export router
//  **************************************** */
// module.exports = router
// const express = require("express")
// const router = express.Router()
// const { body } = require("express-validator")

// const accountController = require("../controllers/accountController")
// const regValidate = require("../utilities/account-validation")
// const authorize = require("../utilities/authorize")
// const utilities = require("../utilities")

// /* ***************************************
//  * Default /account route
//  * Redirects to management if logged in
//  ***************************************/
// router.get("/", authorize.checkJWTToken, (req, res) => {
//   if (res.locals.loggedin) {
//     return res.redirect("management") // relative redirect
//   } else {
//     return res.redirect("login")
//   }
// })

// /* ***************************************
//  * Account Management
//  ***************************************/
// router.get(
//   "/management",
//   authorize.checkJWTToken,
//   utilities.handleErrors(accountController.accountManagement)
// )

// /* ***************************************
//  * Login
//  ***************************************/
// router.get("/login", utilities.handleErrors(accountController.buildLogin))
// router.post(
//   "/login",
//   regValidate.loginRules(),
//   regValidate.checkLoginData,
//   utilities.handleErrors(accountController.accountLogin)
// )

// /* ***************************************
//  * Registration
//  ***************************************/
// router.get("/register", utilities.handleErrors(accountController.buildRegister))
// router.post(
//   "/register",
//   regValidate.registrationRules(),
//   regValidate.checkRegData,
//   utilities.handleErrors(accountController.registerAccount)
// )

// /* ***************************************
//  * Update Account
//  ***************************************/
// router.get(
//   "/update/:account_id",
//   utilities.handleErrors(accountController.buildAccountUpdateView)
// )
// router.post(
//   "/update",
//   [
//     body("account_firstname").trim().notEmpty().withMessage("First name is required"),
//     body("account_lastname").trim().notEmpty().withMessage("Last name is required"),
//     body("account_email").trim().isEmail().withMessage("Valid email is required"),
//   ],
//   utilities.handleErrors(accountController.updateAccount)
// )

// /* ***************************************
//  * Change Password
//  ***************************************/
// router.post(
//   "/change-password",
//   [
//     body("account_password")
//       .trim()
//       .notEmpty()
//       .isStrongPassword({ minLength: 12, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 })
//       .withMessage("Password must meet requirements"),
//   ],
//   utilities.handleErrors(accountController.updatePassword)
// )

// /* ***************************************
//  * Logout
//  ***************************************/
// router.get("/logout", (req, res) => {
//   res.clearCookie("jwt")
//   if (req.session) req.session.destroy(() => res.redirect("/"))
//   else res.redirect("/")
// })

// module.exports = router
const express = require("express")
const router = express.Router()
const { body } = require("express-validator")
const accountController = require("../controllers/accountController")
const utilities = require("../utilities")
const regValidate = require("../utilities/account-validation")
const authorize = require("../utilities/authorize")

/* Default /account route */
router.get("/", authorize.checkJWTToken, (req, res) => {
  if (res.locals.loggedin) return res.redirect("/account/management")
  res.redirect("/account/login")
})

/* Account Management */
router.get("/management", authorize.checkJWTToken, utilities.handleErrors(accountController.accountManagement))

/* Login */
router.get("/login", utilities.handleErrors(accountController.buildLogin))
router.post("/login", regValidate.loginRules(), regValidate.checkLoginData, utilities.handleErrors(accountController.accountLogin))

/* Register */
router.get("/register", utilities.handleErrors(accountController.buildRegister))
router.post("/register", regValidate.registrationRules(), regValidate.checkRegData, utilities.handleErrors(accountController.registerAccount))

/* Update Account */
router.get("/update/:account_id", utilities.handleErrors(accountController.buildAccountUpdateView))
router.post("/update", [
  body("account_firstname").trim().notEmpty().withMessage("First name is required"),
  body("account_lastname").trim().notEmpty().withMessage("Last name is required"),
  body("account_email").trim().isEmail().withMessage("Valid email is required")
], utilities.handleErrors(accountController.updateAccount))

/* Change Password */
router.post("/change-password", [
  body("account_password").trim().isStrongPassword({
    minLength: 12, minLowercase:1, minUppercase:1, minNumbers:1, minSymbols:1
  }).withMessage("Password must meet requirements")
], utilities.handleErrors(accountController.updatePassword))

/* Logout */
router.get("/logout", (req, res) => {
  res.clearCookie("jwt");       // Remove JWT cookie
  if (req.session) {
    req.session.destroy(() => { // Destroy server session
      res.redirect("/");        // Send user to home
    });
  } else {
    res.redirect("/");          // Just redirect if no session
  }
});


module.exports = router
