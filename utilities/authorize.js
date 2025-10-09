// // const jwt = require("jsonwebtoken");

// // const authorize = {};

// // /* Middleware to check if user is logged in for views */
// // authorize.checkJWTToken = (req, res, next) => {
// //   const token = req.cookies.jwt;
// //   if (!token) {
// //     res.locals.loggedin = false;
// //     res.locals.account = null;
// //     return next();
// //   }

// //   try {
// //     const decoded = jwt.verify(token, process.env.JWT_SECRET);
// //     res.locals.loggedin = true;
// //     res.locals.account = decoded;
// //     next();
// //   } catch (error) {
// //     res.locals.loggedin = false;
// //     res.locals.account = null;
// //     next();
// //   }
// // };

// // /* Middleware to check Employee/Admin for inventory */
// // authorize.checkInventoryAccess = (req, res, next) => {
// //   const token = req.cookies.jwt;
// //   if (!token) {
// //     return res.status(401).render("account/login", {
// //       title: "Login",
// //       nav: null,
// //       message: "You must be logged in to access this page.",
// //     });
// //   }

// //   try {
// //     const decoded = jwt.verify(token, process.env.JWT_SECRET);
// //     if (decoded.account_type === "Employee" || decoded.account_type === "Admin") {
// //       res.locals.loggedin = true;
// //       res.locals.account = decoded;
// //       next();
// //     } else {
// //       return res.status(403).render("account/login", {
// //         title: "Login",
// //         nav: null,
// //         message: "You do not have permission to access this page.",
// //       });
// //     }
// //   } catch (error) {
// //     return res.status(403).render("account/login", {
// //       title: "Login",
// //       nav: null,
// //       message: "You do not have permission to access this page.",
// //     });
// //   }
// // };

// module.exports = authorize;
const jwt = require("jsonwebtoken");

const authorize = {};

// Middleware to check JWT and set account info for views
authorize.checkJWTToken = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    res.locals.loggedin = false;
    res.locals.account = null;
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    res.locals.account = decoded;
    res.locals.loggedin = true;
    next();
  } catch (error) {
    console.error("JWT verification failed:", error);
    res.locals.loggedin = false;
    res.locals.account = null;
    next();
  }
};

// Middleware to restrict inventory pages to Employee/Admin
authorize.checkInventoryAccess = (req, res, next) => {
  const account = res.locals.account;

  if (!account) {
    return res.redirect("/account/login");
  }

  if (account.account_type === "Employee" || account.account_type === "Admin") {
    return next();
  }

  return res.status(403).render("account/login", {
    title: "Login",
    nav: null,
    alert: "You do not have permission to access this page.",
  });
};

module.exports = authorize;
// const jwt = require("jsonwebtoken");

// const authorize = {};

// // Middleware: check if logged in for views
// authorize.checkJWTToken = (req, res, next) => {
//   const token = req.cookies.jwt;
//   if (!token) {
//     res.locals.loggedin = false;
//     return next();
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
//     res.locals.account = decoded;
//     res.locals.loggedin = true;
//     next();
//   } catch (err) {
//     res.locals.loggedin = false;
//     next();
//   }
// };

// module.exports = authorize;
