// /* controllers/invController.js */
// const invModel = require("../models/inventory-model")
// const utilities = require("../utilities/")
// const { body, validationResult } = require('express-validator'); // <--- THIS IS REQUIRED

// const invCont = {}

// /* ***************************
//  *  Build inventory by classification view
//  * ************************** */
// invCont.buildByClassificationId = async function (req, res, next) {
//   const classification_id = req.params.classificationId
//   const data = await invModel.getInventoryByClassificationId(classification_id)
//   const grid = await utilities.buildClassificationGrid(data)
//   let nav = await utilities.getNav()
//   const className = data[0].classification_name
//   res.render("./inventory/classification", {
//     title: className + " vehicles",
//     nav,
//     grid,
//   })
// }
// /* ***************************
//   *  Build add-classification view
//   * ************************** */
// /* Handle add-classification form submission */
// invCont.addClassification = async (req, res, next) => {
//   const { classification_name } = req.body
//   const nav = await utilities.getNav()

//   try {
//     const result = await invModel.addClassification(classification_name)
//     if (result) {
//       req.flash("success", `Classification "${classification_name}" added successfully.`)
//       const updatedNav = await utilities.getNav()
//       res.render("inventory/management", {
//         title: "Inventory Management",
//         nav: updatedNav,
//         errors: null
//       })
//     } else {
//       req.flash("error", "Failed to add classification.")
//       res.render("inventory/add-classification", {
//         title: "Add Classification",
//         nav,
//         errors: null
//       })
//     }
//   } catch (error) {
//     next(error)
//   }
// }

// /* ***************************
//  *  Build vehicle detail view
//  * ************************** */
// invCont.buildInventoryDetail = async function (req, res, next) {
//   try {
//     const invId = req.params.invId
//     const vehicle = await invModel.getInventoryById(invId) // single object

//     if (!vehicle) {
//       return res.status(404).render("errors/404", { message: "Vehicle not found" })
//     }

//     const nav = await utilities.getNav()
//     const vehicleDetailHTML = await utilities.buildVehicleDetailHTML(vehicle)

//     res.render("./inventory/detail", {
//       title: `${vehicle.inv_make} ${vehicle.inv_model}`,
//       nav,
//       vehicleDetailHTML
//     })
//   } catch (error) {
//     console.error("buildInventoryDetail error:", error)
//     res.status(500).render("errors/500", { message: "Server error" })
//   }
// }
// // Render add-classification form
// invCont.buildAddClassification = async (req, res, next) => {
//   try {
//     const nav = await utilities.getNav()
//     res.render("inventory/add-classification", {
//       title: "Add Classification",
//       nav,
//       errors: null,
//     })
//   } catch (error) {
//     next(error)
//   }
// }

// // Render add-inventory form
// invCont.buildAddInventory = async (req, res, next) => {
//   try {
//     const nav = await utilities.getNav()
//     const classificationList = await utilities.buildClassificationList()
//     res.render("inventory/add-inventory", {
//       title: "Add Inventory",
//       nav,
//       classificationList,
//       errors: null,
//     })
//   } catch (error) {
//     next(error)  // this prevents the 500 crash
//   }
// }


// // GET Add Inventory Form
// exports.showAddInventory = async (req, res) => {
//   try {
//     const classifications = await pool.query('SELECT * FROM classification ORDER BY classification_name');
//     res.render('add-inventory', { 
//       classifications: classifications.rows, 
//       errors: [], 
//       successMessage: null 
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).send('Server error');
//   }
// };

// // POST Add Inventory
// exports.addInventory = [
//   // Server-side validation
//   body('inv_make').trim().notEmpty().withMessage('Make is required'),
//   body('inv_model').trim().notEmpty().withMessage('Model is required'),
//   body('inv_year').trim().isLength({ min: 4, max: 4 }).withMessage('Year must be 4 digits'),
//   body('inv_description').trim().notEmpty().withMessage('Description is required'),
//   body('inv_image').trim().notEmpty().withMessage('Image path is required'),
//   body('inv_thumbnail').trim().notEmpty().withMessage('Thumbnail path is required'),
//   body('inv_price').isNumeric().withMessage('Price must be a number'),
//   body('inv_miles').isInt({ min: 0 }).withMessage('Miles must be a number >= 0'),
//   body('inv_color').trim().notEmpty().withMessage('Color is required'),
//   body('classification_id').isInt().withMessage('Classification is required'),

//   async (req, res) => {
//     const errors = validationResult(req);
//     const classifications = await pool.query('SELECT * FROM classification ORDER BY classification_name');

//     if (!errors.isEmpty()) {
//       // Render the form again with sticky values and errors
//       return res.render('add-inventory', { 
//         classifications: classifications.rows,
//         errors: errors.array(),
//         successMessage: null,
//         ...req.body
//       });
//     }

//     try {
//       const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body;

//       const sql = `
//         INSERT INTO inventory
//           (inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id)
//         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
//       `;
//       await pool.query(sql, [inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id]);

//       res.render('add-inventory', { 
//         classifications: classifications.rows,
//         errors: [],
//         successMessage: 'Inventory added successfully!',
//       });

//     } catch (err) {
//       console.error(err);
//       res.status(500).send('Server error');
//     }
//   }
// ];
// /* ***************************
//  *  Build management view 
// For now, there should NOT be a link to reach this view in any other view.
// It will be accessed only by direct manipulation of the URL. Use this route: site-name/inv/)
//  * ************************** */
// invCont.buildManagement = async function (req, res, next) {
//   try {
//     let nav = await utilities.getNav()
//     res.render("inventory/management", {
//       title: "Inventory Management",
//       nav,
//       errors: null,
//     })
//   } catch (error) {
//     next(error)
//   }
// }


// module.exports = invCont
/* controllers/invController.js */
const invModel = require("../models/inventory-model")
const utilities = require("../utilities")
const { body, validationResult } = require('express-validator')

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  try {
    const classification_id = req.params.classificationId
    const data = await invModel.getInventoryByClassificationId(classification_id)
    const grid = await utilities.buildClassificationGrid(data)
    const nav = await utilities.getNav()
    const className = data[0]?.classification_name || "Vehicles"
    res.render("inventory/classification", {
      title: className + " vehicles",
      nav,
      grid,
    })
  } catch (error) {
    next(error)
  }
}

/* ***************************
 *  Build add-classification view
 * ************************** */
invCont.buildAddClassification = async (req, res, next) => {
  try {
    const nav = await utilities.getNav()
    res.render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors: null
    })
  } catch (error) {
    next(error)
  }
}

/* Handle add-classification form submission */
invCont.addClassification = async (req, res, next) => {
  try {
    const { classification_name } = req.body
    const nav = await utilities.getNav()
    const result = await invModel.addClassification(classification_name)
    if (result) {
      req.flash("success", `Classification "${classification_name}" added successfully.`)
      res.render("inventory/management", {
        title: "Inventory Management",
        nav,
        errors: null
      })
    } else {
      req.flash("error", "Failed to add classification.")
      res.render("inventory/add-classification", {
        title: "Add Classification",
        nav,
        errors: null
      })
    }
  } catch (error) {
    next(error)
  }
}

/* ***************************
 *  Build vehicle detail view
 * ************************** */
invCont.buildInventoryDetail = async function (req, res, next) {
  try {
    const invId = req.params.invId
    const vehicle = await invModel.getInventoryById(invId)
    if (!vehicle) {
      return res.status(404).render("errors/404", { message: "Vehicle not found" })
    }

    const nav = await utilities.getNav()
    const vehicleDetailHTML = await utilities.buildVehicleDetailHTML(vehicle)

    res.render("inventory/detail", {
      title: `${vehicle.inv_make} ${vehicle.inv_model}`,
      nav,
      vehicleDetailHTML
    })
  } catch (error) {
    console.error("buildInventoryDetail error:", error)
    res.status(500).render("errors/500", { message: "Server error" })
  }
}

/* ***************************
 *  Render Add Inventory Form
 * ************************** */
invCont.buildAddInventory = async (req, res, next) => {
  try {
    const nav = await utilities.getNav()
    const classificationList = await utilities.buildClassificationList()
    res.render("inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      classificationList,
      errors: [],
      flashMessage: null,
      inv_make: "",
      inv_model: "",
      inv_year: "",
      inv_description: "",
      inv_image: "/images/no-image.png",
      inv_thumbnail: "/images/no-image-tn.png",
      inv_price: "",
      inv_miles: "",
      inv_color: ""
    })
  } catch (error) {
    next(error)
  }
}

/* ***************************
 *  Handle Add Inventory POST
 * ************************** */
invCont.addInventory = [
  // Validation rules
  body('inv_make').trim().notEmpty().withMessage('Make is required'),
  body('inv_model').trim().notEmpty().withMessage('Model is required'),
  body('inv_year').trim().isLength({ min: 4, max: 4 }).withMessage('Year must be 4 digits'),
  body('inv_description').trim().notEmpty().withMessage('Description is required'),
  body('inv_image').trim().notEmpty().withMessage('Image path is required'),
  body('inv_thumbnail').trim().notEmpty().withMessage('Thumbnail path is required'),
  body('inv_price').isNumeric().withMessage('Price must be a number'),
  body('inv_miles').isInt({ min: 0 }).withMessage('Miles must be a number >= 0'),
  body('inv_color').trim().notEmpty().withMessage('Color is required'),
  body('classification_id').isInt().withMessage('Classification is required'),

  // Handler
  async (req, res, next) => {
    try {
      const errors = validationResult(req)
      const nav = await utilities.getNav()
      const classificationList = await utilities.buildClassificationList(req.body.classification_id)

      if (!errors.isEmpty()) {
        // Render form with errors & sticky inputs
        return res.render("inventory/add-inventory", {
          title: "Add Inventory",
          nav,
          classificationList,
          errors: errors.array(),
          flashMessage: null,
          ...req.body
        })
      }

      // Add inventory item via model
      await invModel.addInventoryItem(req.body)

      // Render form with success message and empty inputs
      res.render("inventory/add-inventory", {
        title: "Add Inventory",
        nav,
        classificationList: await utilities.buildClassificationList(),
        errors: [],
        flashMessage: "Inventory added successfully!",
        inv_make: "",
        inv_model: "",
        inv_year: "",
        inv_description: "",
        inv_image: "/images/no-image.png",
        inv_thumbnail: "/images/no-image-tn.png",
        inv_price: "",
        inv_miles: "",
        inv_color: ""
      })
    } catch (error) {
      console.error(error)
      const classificationList = await utilities.buildClassificationList(req.body.classification_id)
      res.render("inventory/add-inventory", {
        title: "Add Inventory",
        nav: await utilities.getNav(),
        classificationList,
        errors: [],
        flashMessage: "Failed to add inventory item. Please try again.",
        ...req.body
      })
    }
  }
]

/* ***************************
 *  Build management view
 * ************************** */
invCont.buildManagement = async function (req, res, next) {
  try {
    const nav = await utilities.getNav()
    res.render("inventory/management", {
      title: "Inventory Management",
      nav,
      errors: null
    })
  } catch (error) {
    next(error)
  }
}

module.exports = invCont
