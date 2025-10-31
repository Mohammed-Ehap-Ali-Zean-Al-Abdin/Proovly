import { Router } from 'express'
import multer from 'multer'
import { requireAuth } from '../middleware/auth.js'
import { getStorage } from '../services/storage/index.js'

const router = Router()
const upload = multer()

// POST /media/upload - upload a proof image/file to Cloudinary
router.post('/upload', requireAuth(['ngo', 'admin']), upload.single('file'), async (req, res, next) => {
  try {
    const file = req.file
    if (!file) return res.status(400).json({ error: 'file is required' })
    const storage = getStorage()
    const result = await storage.uploadBuffer(file.buffer, file.originalname || 'proof')
    res.status(201).json(result)
  } catch (err) {
    next(err)
  }
})

export default router
