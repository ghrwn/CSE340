const utilities = require("../utilities")
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

/* ****************************************
 *  Deliver login view
 * *************************************** */
async function buildLogin(req, res) {
  const nav = await utilities.getNav()
  res.render("account/login", {
    title: "Login",
    nav,
    errors: null,
  })
}

/* ****************************************
 *  Deliver registration view
 * *************************************** */
async function buildRegister(req, res) {
  const nav = await utilities.getNav()
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
  })
}

/* ****************************************
 *  Deliver account management view
 * *************************************** */
async function buildAccountManagement(req, res) {
  const nav = await utilities.getNav()

  // Use the JWT payload already stored in locals by checkJWTToken middleware
  res.render("account/management", {
    title: "Account Management",
    nav,
    errors: null,
  })
}

/* ****************************************
 *  Deliver account update view
 * *************************************** */
async function buildUpdateView(req, res) {
  const nav = await utilities.getNav()
  const account_id = parseInt(req.params.account_id)

  // Prevent editing someone else’s account
  const loggedInId = res.locals.accountData?.account_id
  if (!loggedInId || loggedInId !== account_id) {
    req.flash("notice", "You can only update your own account.")
    return res.redirect("/account/")
  }

  const accountData = await accountModel.getAccountById(account_id)

  if (!accountData) {
    req.flash("notice", "Account not found.")
    return res.redirect("/account/")
  }

  return res.render("account/update", {
    title: "Update Account",
    nav,
    errors: null,
    accountData,
  })
}

/* ****************************************
 *  Process account info update
 * *************************************** */
async function updateAccount(req, res) {
  const nav = await utilities.getNav()

  const { account_id, account_firstname, account_lastname, account_email } =
    req.body

  const parsedId = parseInt(account_id)

  // Prevent editing someone else’s account
  const loggedInId = res.locals.accountData?.account_id
  if (!loggedInId || loggedInId !== parsedId) {
    req.flash("notice", "You can only update your own account.")
    return res.redirect("/account/")
  }

  const updateResult = await accountModel.updateAccount(
    parsedId,
    account_firstname,
    account_lastname,
    account_email
  )

  if (updateResult) {
    // Re-query account data after update (assignment requirement)
    const freshAccount = await accountModel.getAccountById(parsedId)

    // Re-issue JWT cookie so header greeting updates immediately
    if (freshAccount) {
      const accessToken = jwt.sign(freshAccount, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: 3600,
      })

      res.cookie("jwt", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 3600 * 1000,
      })

      res.locals.accountData = freshAccount
    }

    req.flash("success", "Account updated successfully.")
    return res.render("account/management", {
      title: "Account Management",
      nav,
      errors: null,
    })
  }

  req.flash("notice", "Sorry, the update failed.")
  return res.status(500).render("account/update", {
    title: "Update Account",
    nav,
    errors: null,
    accountData: {
      account_id: parsedId,
      account_firstname,
      account_lastname,
      account_email,
    },
  })
}

/* ****************************************
 *  Process password update
 * *************************************** */
async function updatePassword(req, res) {
  const nav = await utilities.getNav()
  const { account_id, account_password } = req.body
  const parsedId = parseInt(account_id)

  // Prevent editing someone else’s account
  const loggedInId = res.locals.accountData?.account_id
  if (!loggedInId || loggedInId !== parsedId) {
    req.flash("notice", "You can only update your own account.")
    return res.redirect("/account/")
  }

  let hashedPassword
  try {
    hashedPassword = bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", "Sorry, the password update failed.")
    return res.redirect(`/account/update/${parsedId}`)
  }

  const updateResult = await accountModel.updatePassword(parsedId, hashedPassword)

  if (updateResult) {
    // Re-query account data (assignment requirement)
    const freshAccount = await accountModel.getAccountById(parsedId)
    if (freshAccount) res.locals.accountData = freshAccount

    req.flash("success", "Password updated successfully.")
    return res.render("account/management", {
      title: "Account Management",
      nav,
      errors: null,
    })
  }

  req.flash("notice", "Sorry, the password update failed.")
  return res.redirect(`/account/update/${parsedId}`)
}

/* ****************************************
 *  Process Registration
 * *************************************** */
async function registerAccount(req, res) {
  const nav = await utilities.getNav()
  const {
    account_firstname,
    account_lastname,
    account_email,
    account_password,
  } = req.body

  let hashedPassword
  try {
    hashedPassword = bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", "Sorry, there was an error processing the registration.")
    return res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you're registered ${account_firstname}. Please log in.`
    )
    return res.status(201).render("account/login", {
      title: "Login",
      nav,
      errors: null,
    })
  }

  req.flash("notice", "Sorry, the registration failed.")
  return res.status(501).render("account/register", {
    title: "Registration",
    nav,
    errors: null,
  })
}

/* ****************************************
 *  Process Login (JWT + Cookie)
 * *************************************** */
async function accountLogin(req, res) {
  const nav = await utilities.getNav()
  const { account_email, account_password } = req.body

  const accountData = await accountModel.getAccountByEmail(account_email)

  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    return res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    })
  }

  try {
    const match = bcrypt.compareSync(
      account_password,
      accountData.account_password
    )

    if (!match) {
      req.flash("notice", "Please check your credentials and try again.")
      return res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      })
    }

    delete accountData.account_password

    const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: 3600,
    })

    res.cookie("jwt", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 3600 * 1000,
    })

    req.flash("success", "You are logged in.")
    return res.redirect("/account/")
  } catch (error) {
    console.error(error)
    req.flash("notice", "Sorry, the login failed.")
    return res.status(500).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    })
  }
}

/* ****************************************
 *  Logout
 * *************************************** */
async function accountLogout(req, res) {
  res.clearCookie("jwt")
  req.flash("notice", "You have been logged out.")
  return res.redirect("/")
}

module.exports = {
  buildLogin,
  buildRegister,
  buildAccountManagement,
  buildUpdateView,
  updateAccount,
  updatePassword,
  registerAccount,
  accountLogin,
  accountLogout,
}