/*database -index.js ✓ */
const { Pool } = require("pg")
require("dotenv").config()

/* ***************
 * Connection Pool
 * SSL Object needed both locally and in production
 * Render requires SSL/TLS
 * If - else will determine logging for development
 * *************** */
let pool
pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
})

// Added for troubleshooting queries
// during development
module.exports = {
  async query(text, params) {
    try {
      const res = await pool.query(text, params)
      if (process.env.NODE_ENV == "development") {
        console.log("executed query", { text })
      }
      return res
    } catch (error) {
      console.error("error in query", { text })
      throw error
    }
  },
}
/* ******************************************
 * End of database/index.js file
 *******************************************/