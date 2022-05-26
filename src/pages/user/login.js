import { Box } from '@chakra-ui/react'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

import { Layout, LoginForm } from '~components'

const LoginPage = ({ seo }) => {
  return (
    <Layout seo={seo}>
      <Box minH='inherit'>
        <LoginForm />
      </Box>
    </Layout>
  )
}

export default LoginPage

export const getStaticProps = async context => {
  const { locale } = context

  const title = {
    en: 'Login',
    tr: 'Giriş',
    nl: 'Login',
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
