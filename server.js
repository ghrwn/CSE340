const express = require("express")
require("dotenv").config()
const app = express()
const expressLayouts = require("express-ejs-layouts")

/* ======================
 * Body Parsing (Built-in Express)
 * ====================== */
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

/* ======================
 * Cookie Parser (for JWT cookie)
 * ====================== */
const cookieParser = require("cookie-parser")
app.use(cookieParser())

/* ======================
 * Session Packages
 * ====================== */
const session = require("express-session")
const pool = require("./database")

/* ======================
 * Utilities & Routes
 * ====================== */
const utilities = require("./utilities")
const staticRoutes = require("./routes/static")
const inventoryRoutes = require("./routes/inventoryRoute")
const accountRoutes = require("./routes/accountRoute")
const favoritesRoutes = require("./routes/favoritesRoute")

/* ***********************
 * Middleware — Sessions
 *************************/
app.use(
  session({
    store: new (require("connect-pg-simple")(session))({
      createTableIfMissing: true,
      pool,
    }),
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    name: "sessionId",
  })
)

/* ***********************
 * Middleware — Flash Messages
 *************************/
app.use(require("connect-flash")())
app.use(function (req, res, next) {
  res.locals.messages = require("express-messages")(req, res)
  next()
})

/* ======================
 * JWT checker middleware (MUST be before routes)
 * ====================== */
app.use(utilities.checkJWTToken)

/* ***********************
 * View Engine & Layout
 *************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout")

/* ***********************
 * Routes
 *************************/
app.use(staticRoutes)
app.use("/inventory", inventoryRoutes)
app.use("/account", accountRoutes)
app.use("/account/favorites", favoritesRoutes)

/* ***********************
 * Home Route
 *************************/
app.get(
  "/",
  utilities.handleErrors(async (req, res) => {
    const nav = await utilities.getNav()
    res.render("index", {
      title: "Home",
      nav,
    })
  })
)

/* ***********************
 * 404 Route (MUST BE LAST)
 *************************/
app.use((req, res, next) => {
  next({
    status: 404,
    message: "Sorry, we appear to have lost that page.",
  })
})

/* ***********************
 * Express Error Handler
 *************************/
app.use(async (err, req, res, next) => {
  const nav = await utilities.getNav()
  console.error(`Error at: "${req.originalUrl}": ${err.message}`)

  const message =
    err.status === 404
      ? err.message
      : "Oh no! There was a crash. Maybe try a different route?"

  res.status(err.status || 500).render("errors/error", {
    title: err.status || "Server Error",
    message,
    nav,
  })
})

/* ***********************
 * Local Server Info
 *************************/
const port = process.env.PORT
const host = process.env.HOST

app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})