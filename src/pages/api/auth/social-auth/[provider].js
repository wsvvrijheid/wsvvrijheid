import { withIronSessionApiRoute } from 'iron-session/next'

import { fetcher, sessionOptions } from '~lib'

const route = async (req, res) => {
  const { provider } = req.query
  if (req.method === 'POST') {
    try {
      let url = `/api/auth/${provider}/callback?access_token=${req.body.access_token}`
      if (provider === 'twitter') {
        url = `/api/auth/${provider}/callback?access_token=${req.body.access_token}&access_secret=${req.body.access_secret}`
      }
      const response = await fetcher.get(url)
      const auth = { ...response.data.user, token: response.data.jwt, user: response.data.user }
      req.session = auth
      await req.session.save()
      res.json(auth)
    } catch (error) {
      if (!error.response?.data?.error.message) {
        return res.status(500).json({ message: 'Internal server error' })
      } else {
        const messages = error.response?.data?.error.message
        return res.status(403).json({ message: messages })
      }
    }
  }
}

const handler = withIronSessionApiRoute(route, sessionOptions)

export default handler
