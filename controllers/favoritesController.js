const favoritesModel = require("../models/favorites-model")
const utilities = require("../utilities")

// Add favorite
async function addFavorite(req, res) {
  try {
    const account = res.locals.account
    if (!account) return res.redirect("/account/login")

    const inv_id = parseInt(req.params.inv_id)
    await favoritesModel.addFavorite(account.account_id, inv_id)
    req.flash("success", "Vehicle added to favorites!")
    res.redirect(`/inv/detail/${inv_id}`)
  } catch (error) {
    console.error("Add favorite failed:", error)
    res.status(500).render("errors/500", { message: "Server error adding favorite." })
  }
}


// Remove favorite
async function removeFavorite(req, res) {
  try {
    const account = res.locals.account
    const inv_id = parseInt(req.params.inv_id)
    await favoritesModel.removeFavorite(account.account_id, inv_id)
    req.flash("info", "Removed from favorites.")
    res.redirect("/favorites")
  } catch (error) {
    console.error("Remove favorite failed:", error)
    res.status(500).render("errors/500", { message: "Server error removing favorite." })
  }
}
// View all favorites
async function viewFavorites(req, res, next) {
  try {
    const nav = await utilities.getNav();
    const userId = res.locals.account?.account_id;

    if (!userId) {
      return res.redirect("/account/login");
    }

    const favorites = await favoritesModel.getFavoritesByUser(userId);

    res.render("account/favorites", {
      title: "My Favorites",
      nav,
      loggedin: true,
      favorites
    });
  } catch (error) {
    next(error);
  }
}
// // View favorites
// async function viewFavorites(req, res) {
//   try {
//     const account = res.locals.account
//     if (!account) return res.redirect("/account/login")

//     const nav = await utilities.getNav()
//     const favorites = await favoritesModel.getFavoritesByAccount(account.account_id)
//     res.render("account/favorites", {
//       title: "My Favorites",
//       nav,
//       favorites,
//       loggedin: true
//     })
//   } catch (error) {
//     console.error("View favorites failed:", error)
//     res.status(500).render("errors/500", { message: "Server error showing favorites." })
//   }
// }

module.exports = { addFavorite, viewFavorites, removeFavorite }
