const express = require("express")
const router = new express.Router()

const utilities = require("../utilities")
const accountController = require("../controllers/accountController")
const regValidate = require("../utilities/account-validation")

/* ****************************************
 *  Deliver Login View
 * *************************************** */
router.get("/login", utilities.handleErrors(accountController.buildLogin))

/* ****************************************
 *  Deliver Registration View
 * *************************************** */
router.get("/register", utilities.handleErrors(accountController.buildRegister))

/* ****************************************
 * Account Management View (default /account/)
 * *************************************** */
router.get(
  "/",
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildAccountManagement)
)

/* ****************************************
 * Deliver Account Update View
 * /account/update/:account_id
 * *************************************** */
router.get(
  "/update/:account_id(\\d+)",
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildUpdateView)
)

/* ****************************************
 * Process Account Info Update
 * /account/update
 * *************************************** */
router.post(
  "/update",
  utilities.checkLogin,
  regValidate.accountUpdateRules(),
  regValidate.checkAccountUpdateData,
  utilities.handleErrors(accountController.updateAccount)
)

/* ****************************************
 * Process Password Update
 * /account/update-password
 * *************************************** */
router.post(
  "/update-password",
  utilities.checkLogin,
  regValidate.passwordRules(),
  regValidate.checkPasswordData,
  utilities.handleErrors(accountController.updatePassword)
)

/* ****************************************
 * Logout
 * *************************************** */
router.get(
  "/logout",
  utilities.checkLogin,
  utilities.handleErrors(accountController.accountLogout)
)

/* ****************************************
 * Process Registration
 * *************************************** */
router.post(
  "/register",
  regValidate.registationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
)

/* ****************************************
 * Process Login (JWT)
 * *************************************** */
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
)

module.exports = router