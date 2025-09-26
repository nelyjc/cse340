/*utilities/index.js*/
const invModel = require("../models/inventory-model")
const Util = {}

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
* ************************************ */
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
  detailHTML += `<li><strong>Mileage:</strong> ${new Intl.NumberFormat('en-US').format(vehicle.inv_mileage)} miles</li>`
  detailHTML += `<li><strong>Year:</strong> ${vehicle.inv_year}</li>`
  detailHTML += `<li><strong>VIN:</strong> ${vehicle.inv_vin}</li>`
  detailHTML += `</ul></div></div>`
  return detailHTML
}

module.exports = Util
