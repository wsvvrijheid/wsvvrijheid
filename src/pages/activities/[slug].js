import { Box, Heading, Spinner, Stack } from '@chakra-ui/react'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { serialize } from 'next-mdx-remote/serialize'

import { ChakraNextImage, Container, Layout, Markdown } from '~components'
import { getActivity, getActivityPaths } from '~services'

const ActivityDetailPage = ({ seo, source, image }) => {
  if (!source) return <Spinner />

  return (
    <Layout seo={seo}>
      <Container maxW='container.md'>
        <Stack py={8} spacing={8}>
          <ChakraNextImage ratio='twitter' image={image} rounded='lg' />
          <Heading textAlign='center'>{seo.title}</Heading>
          <Box textAlign={{ base: 'left', lg: 'justify' }}>
            <Markdown source={source} />
          </Box>
        </Stack>
      </Container>
    </Layout>
  )
}
export default ActivityDetailPage

export const getStaticPaths = async context => {
  const paths = await getActivityPaths(context.locales)

  return {
    paths,
    fallback: true,
  }
}

export const getStaticProps = async context => {
  const locale = context.locale

  const slug = context.params?.slug

  const activity = await getActivity(locale, slug)

  if (!activity) return { notFound: true }

  const title = activity.title || null
  const content = activity.content || null
  const image = activity.image || null

  const seo = {
    title,
    content,
  }

  const source = await serialize(content || '')

  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
      seo,
      image,
      source,
    },
  }
}
