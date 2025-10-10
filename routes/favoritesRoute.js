// routes/favoritesRoute.js
const express = require("express")
const router = express.Router()
const utilities = require("../utilities")
const authorize = require("../utilities/authorize")
const favoritesController = require("../controllers/favoritesController")

// Add a favorite
router.get("/add/:inv_id", authorize.checkJWTToken, utilities.handleErrors(favoritesController.addFavorite))

// View all favorites
router.get("/", authorize.checkJWTToken, utilities.handleErrors(favoritesController.viewFavorites))

// Remove a favorite
router.get("/remove/:inv_id", authorize.checkJWTToken, utilities.handleErrors(favoritesController.removeFavorite))

module.exports = router
