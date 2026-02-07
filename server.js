const express = require("express")
require("dotenv").config()
const app = express()
const expressLayouts = require("express-ejs-layouts")

/* ======================
 * NEW: Body Parser
 * ====================== */
const bodyParser = require("body-parser")

/* ======================
 * NEW: Session Packages
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

/* ***********************
 * Middleware — Body Parser
 *************************/
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

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