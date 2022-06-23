import { Box, Center } from '@chakra-ui/react'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

import { Container, Layout } from '~components'

export default function NotFound() {
  return (
    <Layout>
      <Center h='60vh' color='blue.500'>
        <Container>
          <Box textAlign='center' fontWeight={900} fontSize='5xl'>
            Page not found!
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
