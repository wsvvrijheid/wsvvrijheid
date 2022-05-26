import { Box } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

import { Layout, ResetPasswordForm } from '~components'
import { useAuth } from '~hooks'

const ForgotPassword = ({ seo }) => {
  const router = useRouter()
  const { code } = router.query
  useAuth('/profile', true)

  return (
    <Layout seo={seo}>
      <Box minH='inherit'>
        <ResetPasswordForm code={code} />
      </Box>
    </Layout>
  )
}

export default ForgotPassword

export const getStaticProps = async context => {
  const { locale } = context

  const title = {
    en: 'Reset Password',
    tr: 'Şifre Sıfırla',
    nl: 'Wachtwoord Resetten',
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
