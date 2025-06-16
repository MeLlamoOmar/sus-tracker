import { Router } from 'express'
import { createSubscription, deleteSubscription, getSubscriptions, getSubscriptionsById, updateSubscription } from '@/controller/subscriptionController.js'

const router = Router()

router.get('/', getSubscriptions)
router.get('/:id', getSubscriptionsById)
router.post('/', createSubscription)
router.put('/:id', updateSubscription)
router.delete('/:id', deleteSubscription)

export default router
