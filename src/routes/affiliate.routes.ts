import { Router } from 'express'
import * as AffiliateController from '../controllers/affiliate.controller.js'

const router = Router()

router.get('/', AffiliateController.index)
router.get('/create', AffiliateController.createForm)
router.post('/create', AffiliateController.createAction)
router.get('/:id', AffiliateController.show)
router.get('/:id/edit', AffiliateController.editForm)
router.post('/:id/edit', AffiliateController.editAction)
router.post('/:id/delete', AffiliateController.deleteAction)

export default router
