import { withIronSessionApiRoute } from 'iron-session/next'

import { fetcher, sessionOptions } from '~lib'

const googleRoute = async (req, res) => {
  if (req.method === 'POST') {
    try {
      const response = await fetcher.get(`/api/auth/google/callback?access_token=${req.body.access_token}`)
      const auth = { ...response.data.user, token: response.data.jwt, user: response.data.user }
      req.session = auth
      await req.session.save()
      res.json(auth)
    } catch (error) {
      console.error(error)
      if (!error.response?.data?.error.message) {
        return res.status(500).json({ message: 'Internal server error' })
      } else {
        const messages = error.response?.data?.error.message
        return res.status(403).json({ message: messages })
      }
    }
  }
}

const handler = withIronSessionApiRoute(googleRoute, sessionOptions)

export default handler
