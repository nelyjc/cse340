// utilities/checkLogin.js

const utilities = require("./")

module.exports = (req, res, next) => {
  let account = null
  let loggedin = false

  const token = req.cookies.jwt
  if (token) {
    try {
      const decoded = utilities.verifyJWT(token)
      account = decoded
      loggedin = true
    } catch (err) {
      account = null
      loggedin = false
    }
  } else if (req.session && req.session.accountData) {
    account = req.session.accountData
    loggedin = true
  }

  res.locals.loggedin = loggedin
  res.locals.account = account

  next()
}
