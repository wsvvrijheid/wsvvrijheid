import { Box, Center } from '@chakra-ui/react'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

import { Container, Layout } from '~components'

export default function ErrorPage() {
  return (
    <Layout>
      <Center h='60vh' color='red.400'>
        <Container>
          <Box textAlign='center' fontWeight='black' fontSize='5xl'>
            Error!
          </Box>
        </Container>
      </Center>
    </Layout>
  )
}

export const getStaticProps = async context => {
  const { locale } = context

  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  }
}
