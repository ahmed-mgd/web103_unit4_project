import express from 'express'
import { getAllBuilds, getBuildById, createBuild, updateBuild, deleteBuild } from '../controllers/buildsController.js'

const router = express.Router()

router.get('/builds', getAllBuilds)
router.get('/builds/:id', getBuildById)
router.post('/builds', createBuild)
router.put('/builds/:id', updateBuild)
router.delete('/builds/:id', deleteBuild)

export default router
