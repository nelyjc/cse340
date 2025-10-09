/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const env = require("dotenv").config()
const app = express()
const static = require("./routes/static")
const baseController = require("./controllers/baseController")
const invRoute = require("./routes/inventoryRoute")
const utilities = require("./utilities/")
const session = require("express-session")
const pool = require('./database/')
const accountRoute = require("./routes/accountRoute")
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")
const checkLogin = require("./utilities/checkLogin")
const authorize = require("./utilities/authorize");


/* ***********************
 * Middleware
 * ************************/
 app.use(session({
  store: new (require('connect-pg-simple')(session))({
    pool,
    createTableIfMissing: true,
  }),
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  name: 'sessionId',
}))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded


// Express Messages Middleware
app.use(require('connect-flash')())

// Make flash messages available in all views
app.use((req, res, next) => {
  res.locals.messages = require('express-messages')(req, res)
  next()
})

// Cookie parser middleware
app.use(cookieParser())
// JWT Middleware 
app.use(utilities.checkJWTToken)

// Middleware to decode JWT and make loggedin/account available to all views
app.use(authorize.checkJWTToken);



/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "layouts/layout") // not at view root


/* ***********************
Static
  * Place before all routes
  *************************/
app.use(express.static("public"))

/* ***********************
 * Routes
 *************************/
  
// Index Route
app.get("/", utilities.handleErrors(baseController.buildHome))

// Inventory routes

app.use("/inv", invRoute)


// Account routes

app.use("/account", accountRoute)



// File Not Found Route - must be last route in list
app.use((req, res, next) => {
  const err = new Error("Page Not Found")
  err.status = 404
  next(err)
})
/* ***********************
* Express Error Handler
* Place after all other middleware
*************************/
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav()
  console.error(`Error at: "${req.originalUrl}": ${err.message}`)
  
  const status = err.status || 500
  const message = status === 404 
    ? err.message 
    : "Oh no! There was a crash. Maybe try a different route?"

  res.status(status).render("errors/error", {
    title: status,
    message,
    nav
  })
})

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT || 5500
const host = process.env.HOST || "0.0.0.0"


/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, host, () => {
  console.log(`app listening on ${host}:${port}`)


})
// Intentional 500 error route (week 3- Task 3)

app.get("/throw-error", utilities.handleErrors(async (req, res, next) => {
  throw new Error("Intentional 500 error for testing")
}))

/* ******************************************
 * End of server.js file
 *******************************************/