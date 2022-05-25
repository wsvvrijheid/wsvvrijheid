import { HStack, Stack, StackDivider, Text } from '@chakra-ui/react'
import { withIronSessionSsr } from 'iron-session/next'
import React from 'react'

import { Container, CreateArt, Layout } from '~components'
import { sessionOptions } from '~lib'

const Profile = ({ user }) => {
  return (
    <Layout>
      <Container>
        <Stack divider={<StackDivider borderColor='gray.200' />} spacing={4} align='stretch' marginTop={'50px'}>
          <HStack>
            <Text>Username: </Text>
            <Text>{user?.username}</Text>
          </HStack>
          <HStack>
            <Text>Email: </Text>
            <Text>{user?.email}</Text>
          </HStack>
          <CreateArt />
        </Stack>
      </Container>
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
