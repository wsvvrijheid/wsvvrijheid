import { Alert, AlertDescription, AlertIcon, AlertTitle, Button, Center, Stack } from '@chakra-ui/react'
import axios from 'axios'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import React, { useEffect, useState } from 'react'

import { Layout, Navigate } from '~components'
import { useAuth } from '~hooks'

const AuthProvider = () => {
  const [loading, setLoading] = useState(false)
  const [emailTaken, setEmailTaken] = useState(null)

  const { t } = useTranslation()
  const router = useRouter()
  useAuth('/profile', true)

  useEffect(() => {
    setLoading(true)
    if (router.query.provider && router.query.access_token) {
      axios
        .post(`/api/auth/social-auth/${router.query.provider}`, {
          access_token: router.query.access_token,
        })
        .then(response => {
          if (response.data.token) {
            router.push('/')
          }
        })
        .catch(error => {
          if (error.response?.data.message === 'Email is already taken.') {
            setEmailTaken(true)
          }

          console.error('error', error?.response || error)
          setLoading(false)
        })
    }
  }, [router])

  return (
    <Layout isLoading={loading}>
      {emailTaken && (
        <Center h='calc(70vh)'>
          <Alert as={Stack} status='warning' textAlign='center' py={16} w='container.sm' shadow='lg' rounded='lg'>
            <AlertIcon boxSize='60px' mr={0} />
            <AlertTitle mt={4} mb={1} fontSize='2xl'>
              {t`login.email-taken.title`}
            </AlertTitle>
            <AlertDescription maxWidth='sm'>{t`login.email-taken.description`}</AlertDescription>
            <Navigate as={Button} colorScheme='blue' href='/user/login'>{t`login.sign-in`}</Navigate>
          </Alert>
        </Center>
      )}
    </Layout>
  )
}

export const getStaticPaths = async () => {
  const providers = ['google', 'twitter', 'facebook']

  return {
    paths: providers.map(provider => ({ params: { provider } })),
    fallback: false,
  }
}

export const getStaticProps = async context => {
  const locale = context.locale

  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  }
}

export default AuthProvider
