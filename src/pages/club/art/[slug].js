import { Box, SimpleGrid, Spinner, Stack, Text } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { dehydrate, QueryClient } from 'react-query'

import { ArtContent, ArtDetail, CommentForm, CommentList, Container, Layout } from '~components'
import { useAuth } from '~hooks'
import { getArt, getArtPaths, useGetArt } from '~services'

const ArtPage = ({ seo }) => {
  const { user } = useAuth()

  const {
    query: { slug },
    locale,
  } = useRouter()

  const artQuery = useGetArt(locale, slug)

  // TODO fetch comments
  // TODO fetch other arts in the same category

  return (
    <Layout seo={seo}>
      <Container minH='inherit'>
        {/* TODO Create skeleton components for ArtDetail ArtContent and Comments */}
        {artQuery.isLoading ? (
          <Spinner />
        ) : (
          <SimpleGrid pos='relative' mt={4} p={4} columns={{ base: 1, lg: 2 }} gap={4} alignItems='start'>
            {/* Single Art Images */}
            <Box pos='sticky' top={0}>
              <ArtDetail art={artQuery.data} slug={slug} locale={locale} />
            </Box>

            <Stack spacing={4}>
              {/* Single Art Content */}
              <ArtContent art={artQuery.data} />
              {/* Single Art Comments */}
              <Stack spacing={4}>
                {/*  Comment form */}
                <CommentForm user={user} />

                {/*List comments of the current art */}
                <CommentList comments={[]} />
              </Stack>
            </Stack>
          </SimpleGrid>
        )}
        {/* TODO Translate */}
        <Text>More Like This</Text>

        {/* Other Arts List */}
        <Stack justify='space-between' w='full'>
          {/* TODO Create list of other arts which have the same categories as the current art 
          We don't need to show the current art in the list, please filter it out.
          Remember adding list of ArtCardSkeleton for loading state. */}
        </Stack>
      </Container>
    </Layout>
  )
}

export default ArtPage

export const getStaticPaths = async context => {
  const paths = await getArtPaths(context.locales)
  return {
    paths,
    fallback: true,
  }
}

export const getStaticProps = async context => {
  const { locale, params } = context
  const queryClient = new QueryClient()

  // See: `useGetArt` (services/art/find-one.js)
  // [arts, locale, slug]
  const queryKey = ['art', locale, params.slug]

  await queryClient.prefetchQuery({
    queryKey,
    queryFn: () => getArt(locale, params.slug),
  })

  const art = queryClient.getQueryData(queryKey)

  if (!art)
    return {
      notFound: true,
    }

  const seo = {
    title: art.title,
    description: art.description,
    content: art.content,
  }

  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
      seo,
      dehydratedState: dehydrate(queryClient),
    },
  }
}
