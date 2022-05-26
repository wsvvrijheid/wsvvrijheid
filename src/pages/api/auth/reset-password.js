import axios from 'axios'
import { withIronSessionApiRoute } from 'iron-session/next'

import { sessionOptions } from '~lib'

const resetPassRoute = async (req, res) => {
  const { code, password, passwordConfirmation } = req.body
  try {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/reset-password`, {
      code,
      password,
      passwordConfirmation,
    })

    // !! set session here

    // const token = response.data.jwt

    // if (token) {
    //   const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/users/me?populate=*`, {
    //     headers: { Authorization: `Bearer ${token}` },
    //   })

    //   const auth = { user: response.data, token, isLoggedIn: true }

    //   req.session = auth
    //   await req.session.save()
    //   res.json(auth)
    // }
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

const handler = withIronSessionApiRoute(resetPassRoute, sessionOptions)

export default handler
