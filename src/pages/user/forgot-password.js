import { Box } from '@chakra-ui/react'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

import { ForgotPasswordForm, Layout } from '~components'
import { useAuth } from '~hooks'

const ForgotPassword = ({ seo }) => {
  useAuth('/profile', true)
  return (
    <Layout seo={seo}>
      <Box minH='inherit'>
        <ForgotPasswordForm />
      </Box>
    </Layout>
  )
}

export default ForgotPassword

export const getStaticProps = async context => {
  const { locale } = context

  const title = {
    en: 'Forgot Password',
    tr: 'Şifremi Unuttum',
    nl: 'Wachtwoord vergeten',
  }

  const description = {
    en: '',
    tr: '',
    nl: '',
  }
  const seo = {
    title: title[locale],
    description: description[locale],
  }

  return {
    props: {
      seo,
      ...(await serverSideTranslations(locale, ['common'])),
    },
  }
}
