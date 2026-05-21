import { Router } from 'express'
import * as UserController from '../controllers/user.controller.js'

const router = Router()

router.get('/', UserController.index)
router.get('/create', UserController.createForm)
router.get('/:id', UserController.show)
router.post('/', UserController.createAction)
router.get('/:id/edit', UserController.editForm)
router.post('/:id/edit', UserController.editAction)
router.post('/:id/delete', UserController.deleteAction)

export default router
