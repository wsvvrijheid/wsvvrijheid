import axios from 'axios'
import { withIronSessionApiRoute } from 'iron-session/next'

import { sessionOptions } from '~lib'

const forgotPassRoute = async (req, res) => {
  const { email } = req.body
  try {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/forgot-password`, {
      email,
    })
    res.json(response.data)
  } catch (error) {
    console.error('error', error.response?.data)
    if (!error.response?.data?.error.message) {
      return res.status(500).json({ message: 'Internal server error' })
    } else {
      res.json(error.response?.data)
    }
  }
}

const handler = withIronSessionApiRoute(forgotPassRoute, sessionOptions)

export default handler
