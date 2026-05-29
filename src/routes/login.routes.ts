import { Router } from 'express'
import * as LoginController from '../controllers/login.controller.js'

const router = Router()

router.get('/', LoginController.loginForm)
router.post('/', LoginController.loginAction)
router.get('/register', LoginController.registerForm)
router.post('/register', LoginController.registerAction)

export default router
