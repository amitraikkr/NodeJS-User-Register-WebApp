const express = require('express')
const router = express.Router()

const useController = require('../controllers/users')

const {forwardAuthenticated} = require('../config/auth')

router.get('/login',forwardAuthenticated, useController.handleGetLoginPage)

router.get('/register', forwardAuthenticated, useController.handleGetRegisterPage)

router.post('/register', useController.handlePostRegisterPage)

router.post('/login', useController.handlePostLoginPage)

router.get('/logout', useController.handleGetLogoutPage)

module.exports = router

