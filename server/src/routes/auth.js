import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { body, validationResult } from 'express-validator'
import { PrismaClient } from '@prisma/client'
import { OAuth2Client } from 'google-auth-library'

const router = Router()
const prisma = new PrismaClient()
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

// POST /auth/signup
router.post(
  '/signup',
  body('name').optional().trim(),
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })

    const { name, email, password } = req.body
    try {
      const existing = await prisma.user.findUnique({ where: { email } })
      if (existing) return res.status(409).json({ error: 'Email already registered' })

      const hashed = await bcrypt.hash(password, 12)
      const user = await prisma.user.create({ data: { name: name || null, email, password: hashed } })
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '8h' })
      res.status(201).json({ token, user: { id: user.id, name: user.name, email: user.email } })
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'Server error' })
    }
  }
)

// POST /auth/login
router.post(
  '/login',
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty(),
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })

    const { email, password } = req.body
    try {
      const user = await prisma.user.findUnique({ where: { email } })
      if (!user) return res.status(401).json({ error: 'Invalid credentials' })

      // Google-only users don't have a password — guide them to Google sign-in
      if (!user.password) {
        return res.status(401).json({ error: 'This account uses Google sign-in. Please use "Continue with Google" instead.' })
      }

      const valid = await bcrypt.compare(password, user.password)
      if (!valid) return res.status(401).json({ error: 'Invalid credentials' })

      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '8h' })
      res.json({ token, user: { id: user.id, name: user.name, email: user.email } })
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'Server error' })
    }
  }
)

// PUT /auth/profile — Update user profile
router.put(
  '/profile',
  body('name').optional().trim(),
  async (req, res) => {
    const authHeader = req.headers.authorization
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized' })
    }
    const token = authHeader.split(' ')[1]
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      const { name } = req.body
      
      const user = await prisma.user.update({
        where: { id: decoded.userId },
        data: { name: name || null }
      })
      
      res.json({ user: { id: user.id, name: user.name, email: user.email } })
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'Server error' })
    }
  }
)

// POST /auth/google — Google Identity Services sign-in
router.post('/google', async (req, res) => {
  const { credential } = req.body
  if (!credential) {
    return res.status(400).json({ error: 'Google credential is required' })
  }

  try {
    // Verify the Google ID token
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    })
    const payload = ticket.getPayload()
    const { sub: googleId, email, name, email_verified } = payload

    if (!email_verified) {
      return res.status(400).json({ error: 'Google email is not verified' })
    }

    let user

    // 1. Check if a user with this googleId already exists
    user = await prisma.user.findUnique({ where: { googleId } })

    if (!user) {
      // 2. Check if a user with this email already exists (email/password user)
      const existingByEmail = await prisma.user.findUnique({ where: { email } })

      if (existingByEmail) {
        // Link Google account to the existing email/password user
        user = await prisma.user.update({
          where: { id: existingByEmail.id },
          data: { googleId },
        })
      } else {
        // 3. Brand new user — create without password
        user = await prisma.user.create({
          data: {
            email,
            name: name || null,
            googleId,
            authProvider: 'google',
          },
        })
      }
    }

    // Sign JWT using the existing system
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '8h' })
    res.json({ token, user: { id: user.id, name: user.name, email: user.email } })
  } catch (err) {
    console.error('Google auth error:', err)
    if (err.message?.includes('Token used too late') || err.message?.includes('Invalid token') || err.message?.includes('Wrong number of segments')) {
      return res.status(401).json({ error: 'Invalid or expired Google token. Please try again.' })
    }
    res.status(500).json({ error: 'Google authentication failed. Please try again.' })
  }
})

export default router
