const express = require("express")
require("dotenv").config()
const app = express()
const expressLayouts = require("express-ejs-layouts")

const utilities = require("./utilities")

const staticRoutes = require("./routes/static")
const inventoryRoutes = require("./routes/inventoryRoute")

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

/* ***********************
 * Home Route (wrapped)
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
app.use(async (req, res, next) => {
  next({
    status: 404,
    message: "Sorry, we appear to have lost that page.",
  })
})

/* ***********************
 * Express Error Handler
 * Place AFTER all routes
 *************************/
app.use(async (err, req, res, next) => {
  const nav = await utilities.getNav()
  console.error(`Error at: "${req.originalUrl}": ${err.message}`)

  let message
  if (err.status == 404) {
    message = err.message
  } else {
    message = "Oh no! There was a crash. Maybe try a different route?"
  }

  res.status(err.status || 500).render("errors/error", {
    title: err.status || "Server Error",
    message,
    nav,
  })
})

/* ***********************
 * Local Server Information
 *************************/
const port = process.env.PORT
const host = process.env.HOST

app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})