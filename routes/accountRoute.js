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