import axios from 'axios'
import { withIronSessionApiRoute } from 'iron-session/next'

import { sessionOptions } from '~lib'

const updateSessionRoute = async (req, res) => {
  const { id } = req.session.user
  const token = req.session.token

  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${id}?populate=*`, {
      headers: { Authorization: `Bearer ${token}` },
    })

    const user = response.data

    req.session.user = user
    await req.session.save()
    res.json(req.session)
  } catch (error) {
    console.error('error', error.response?.data || error)
    if (!error.response?.data?.error.message) {
      return res.status(500).json({ message: 'Internal server error' })
    } else {
      res.json(error.response?.data)
    }
  }
}

const handler = withIronSessionApiRoute(updateSessionRoute, sessionOptions)

export default handler
