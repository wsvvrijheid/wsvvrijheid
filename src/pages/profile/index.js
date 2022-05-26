import { withIronSessionSsr } from 'iron-session/next'
import React from 'react'

import { AuthenticatedUserProfile, Layout } from '~components'
import { sessionOptions } from '~lib'

const Profile = ({ user }) => {
  return (
    <Layout isDark>
      <AuthenticatedUserProfile user={user} />
    </Layout>
  )
}

export default Profile

export const getServerSideProps = withIronSessionSsr(async function ({ req, locale }) {
  const { serverSideTranslations } = require('next-i18next/serverSideTranslations')
  const user = req.session.user

  if (!user) {
    return {
      redirect: {
        permanent: false,
        destination: '/user/login',
      },
      props: {},
    }
  }

  return {
    props: {
      user,
      ...(await serverSideTranslations(locale, ['common'])),
    },
  }
}, sessionOptions)
