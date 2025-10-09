/*utilities/index.js*/
const utilities = require("../utilities/")
const invModel = require("../models/inventory-model")
const { body, validationResult } = require("express-validator")
const Util = {}
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function () {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

/* ****************************************
 * Middleware For Handling Errors
 **************************************** */
Util.handleErrors = (fn) => {
  return async (req, res, next) => {
    try {
      await fn(req, res, next)
    } catch (err) {
      next(err) // passes the error to Express error handler
    }
  }
}

/* **************************************
 * Build the classification view HTML
 ************************************** */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + ' details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid = '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}


/* **************************************
* Build the vehicle detail view HTML
* ************************************ */
Util.buildVehicleDetailHTML = function(vehicle){
  let detailHTML = `<div class="vehicle-detail">`
  detailHTML += `<img src="${vehicle.inv_image}" alt="Image of ${vehicle.inv_make} ${vehicle.inv_model} on CSE Motors" />`
  detailHTML += `<div class="vehicle-info">`
  detailHTML += `<h2>${vehicle.inv_make} ${vehicle.inv_model} Details</h2>`
  detailHTML += `<p class="vehicle-price">Price: $${new Intl.NumberFormat('en-US').format(vehicle.inv_price)}</p>`
  detailHTML += `<p class="vehicle-description">${vehicle.inv_description}</p>`
  detailHTML += `<ul class="vehicle-specs">`
  detailHTML += `<li><strong>Color:</strong> ${vehicle.inv_color}</li>`
  detailHTML += `<li><strong>Mileage:</strong> ${new Intl.NumberFormat('en-US').format(vehicle.inv_miles)} miles</li>`
  detailHTML += `<li><strong>Year:</strong> ${vehicle.inv_year}</li>`
  detailHTML += `<li><strong>VIN:</strong> ${vehicle.inv_vin}</li>`
  detailHTML += `</ul></div></div>`
  return detailHTML
}

/* **************************************
 * Build classification select list for inventory form
 ************************************** */
Util.buildClassificationList = async function(classification_id = null) {
  let data = await invModel.getClassifications()
  let classificationList = '<select name="classification_id" id="classificationList" required>'
  classificationList += "<option value=''>Choose a Classification</option>"
  data.forEach((row) => {
    classificationList += '<option value="' + row.classification_id + '"'
    if (classification_id != null && row.classification_id == classification_id) {
      classificationList += " selected"
    }
    classificationList += ">" + row.classification_name + "</option>"
  })
  classificationList += "</select>"
  return classificationList
}

/* **************************************  
*  Validate classification name
* ************************************ */
Util.classificationValidator = [
    body("classification_name")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Classification name cannot be empty.")
        .matches(/^[A-Za-z0-9]+$/)
        .withMessage("No spaces or special characters allowed."),
    (req, res, next) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.render("inventory/add-classification", {
                title: "Add Classification",
                nav: req.nav,
                errors: errors.array()
            })
        }
        next()
    }
]
/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
    jwt.verify(
      req.cookies.jwt,
      process.env.ACCESS_TOKEN_SECRET,
      function (err, accountData) {
        if (err) {
          req.flash("notice", "Please log in")
          res.clearCookie("jwt")
          return res.redirect("/account/login")
        }
        // set both account and accountData for consistency
        res.locals.account = accountData   // <-- add this
        res.locals.accountData = accountData
        res.locals.loggedin = true
        next()
      }
    )
  } else {
    next()
  }
}

/* ****************************************
 *  Check Login
 * ************************************ */
Util.checkLogin = (req, res, next) => {
  if (req.session.loggedin) {
    res.locals.loggedin = true
    res.locals.accountData = req.session.accountData
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/")
  }
}


module.exports = Util
