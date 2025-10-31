import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import { env } from '../config/env.js'
import crypto from 'crypto'

const router = Router()

// POST /cloudinary/signature - Generate upload signature for direct browser upload
router.post('/signature', requireAuth(['ngo', 'admin']), async (req, res, next) => {
  try {
    if (!env.CLOUDINARY_API_SECRET || !env.CLOUDINARY_CLOUD_NAME || !env.CLOUDINARY_API_KEY) {
      return res.status(503).json({ error: 'Cloudinary not configured' })
    }

    const timestamp = Math.round(Date.now() / 1000)
    const folder = 'proovly'
    
    // Build params to sign
    const paramsToSign = `folder=${folder}&timestamp=${timestamp}`
    
    // Create signature using SHA-256 HMAC
    const signature = crypto
      .createHmac('sha256', env.CLOUDINARY_API_SECRET)
      .update(paramsToSign)
      .digest('hex')

    res.json({
      signature,
      timestamp,
      cloudName: env.CLOUDINARY_CLOUD_NAME,
      apiKey: env.CLOUDINARY_API_KEY,
      folder,
    })
  } catch (err) {
    next(err)
  }
})

export default router
