import express from 'express'
import { getAllComponents, getComponentsByType } from '../controllers/componentsController.js'

const router = express.Router()

router.get('/components', getAllComponents)
router.get('/components/:type', getComponentsByType)

export default router
