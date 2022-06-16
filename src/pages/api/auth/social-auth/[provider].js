import { withIronSessionApiRoute } from 'iron-session/next'

import { fetcher, mutation, request, sessionOptions } from '~lib'

const route = async (req, res) => {
  const { provider } = req.query
  if (req.method === 'POST') {
    try {
      let url = `/api/auth/${provider}/callback?access_token=${req.body.access_token}`

      if (provider === 'twitter') {
        url = `/api/auth/${provider}/callback?access_token=${req.body.access_token}&access_secret=${req.body.access_secret}`
      }

      const socialLoginResponse = await fetcher.get(url)

      const token = socialLoginResponse.data.jwt
      const userId = socialLoginResponse.data.user?.id

      if (token) {
        const artistResponse = await request({
          url: 'api/artists',
          filters: { user: { id: { $eq: userId } } },
        })

        if (!artistResponse?.result?.[0]) {
          await mutation.post('api/artists', {
            data: { user: userId, name: socialLoginResponse.data.user?.username },
          })
        }

        const response = await request({
          url: 'api/users',
          filters: { id: { $eq: userId } },
        })

        const userData = response.result?.[0]

        if (userData) {
          const user = {
            id: userData.id,
            username: userData.username,
            email: userData.email,
            volunteer: userData.volunteer,
            avatar: userData.avatar,
            artist: userData.artist,
          }

          const auth = { user, token, isLoggedIn: true }

          req.session = auth
          await req.session.save()
          res.json(auth)
        }
      }
    } catch (error) {
      if (!error.response?.data?.error.message) {
        return res.status(500).json({ message: 'Internal server error', error })
      } else {
        const messages = error.response?.data?.error.message
        return res.status(403).json({ message: messages })
      }
    }
  }
}

const handler = withIronSessionApiRoute(route, sessionOptions)

export default handler
