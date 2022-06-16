import axios from 'axios'
import { withIronSessionApiRoute } from 'iron-session/next'

import { mutation, sessionOptions } from '~lib'

const registerRoute = async (req, res) => {
  const { name, username, email, password } = req.body

  const trimmedName = name.trim()
  const trimmedUsername = username.trim()
  const trimmedEmail = email.trim()

  try {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/local/register`, {
      username: trimmedUsername,
      email: trimmedEmail,
      password,
    })

    const token = response.data.jwt
    const userId = response.data.user?.id

    await mutation.post('api/artists', { data: { user: userId, name: trimmedName } })

    if (token) {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${userId}?populate=*`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      const user = {
        id: response.data.id,
        username: response.data.username,
        email: response.data.email,
        volunteer: response.data.volunteer,
        avatar: response.data.avatar,
        artist: response.data.artist,
      }

      const auth = { user, token, isLoggedIn: true }

      req.session = auth
      await req.session.save()
      res.json(auth)
    }
  } catch (error) {
    if (!error.response?.data?.error.message) {
      return res.status(500).json({ message: 'Internal server error' })
    } else {
      res.json(error.response?.data)
    }
  }
}

const handler = withIronSessionApiRoute(registerRoute, sessionOptions)

export default handler
