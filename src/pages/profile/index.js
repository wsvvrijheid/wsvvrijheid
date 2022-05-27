import { withIronSessionSsr } from 'iron-session/next'
import React from 'react'

import { AuthenticatedUserProfile, Layout } from '~components'
import { sessionOptions } from '~lib'

const Profile = ({ auth }) => {
  return (
    <Layout isDark>
      <AuthenticatedUserProfile auth={auth} />
    </Layout>
  )
}

export default Profile

export const getServerSideProps = withIronSessionSsr(async function ({ req, locale }) {
  const { serverSideTranslations } = require('next-i18next/serverSideTranslations')
  const auth = req.session

  if (!auth.user) {
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
      auth,
      ...(await serverSideTranslations(locale, ['common'])),
    },
  }
}, sessionOptions)
