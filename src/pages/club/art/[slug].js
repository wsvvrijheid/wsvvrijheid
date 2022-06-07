import { Box, Center, Grid, Heading, SimpleGrid, Spinner, Stack } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { dehydrate, QueryClient } from 'react-query'

import { ArtCard, ArtContent, ArtDetail, CommentForm, CommentList, Container, Layout } from '~components'
import { useAuth } from '~hooks'
import { getArt, getArtPaths, useGetArt } from '~services'

const ArtPage = ({ seo }) => {
  const auth = useAuth()
  const { t } = useTranslation()

  const {
    query: { slug },
    locale,
  } = useRouter()

  const artQuery = useGetArt(locale, slug)

  return (
    <Layout seo={seo}>
      <Container minH='inherit' my={8}>
        {/* TODO Create skeleton components for ArtDetail ArtContent and Comments */}
        {artQuery.isLoading ? (
          <Center minH='inherit'>
            <Spinner />
          </Center>
        ) : (
          <Grid pos='relative' gridTemplateColumns={{ base: '1fr', lg: '3fr 2fr' }} gap={4} alignItems='start'>
            {/* Single Art Images */}
            <Box pos={{ lg: 'sticky' }} top={0}>
              <ArtDetail art={artQuery.data} slug={slug} locale={locale} />
            </Box>

            <Stack spacing={4}>
              {/* Single Art Content */}
              <ArtContent art={artQuery.data} />
              {/* Single Art Comments */}
              <Stack spacing={4}>
                {/*  Comment form */}
                <CommentForm auth={auth} artId={artQuery.data?.id} />

                {/*List comments of the current art */}
                {/* TODO Add CommentSkeleton */}
                <CommentList comments={artQuery.data?.comments} />
              </Stack>
            </Stack>
          </Grid>
        )}

        {/* Other Arts List */}
        {artQuery.data?.arts?.length > 0 && (
          <Stack justify='space-between' w='full' mt={8} spacing={8}>
            <Heading as='h3' size='lg'>
              {t`art.others`}
            </Heading>
            {/* TODO Add ArtCardSkeleton for loading state. */}
            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap={8}>
              {artQuery.data?.arts.map(art => (
                <ArtCard key={art.id} art={art} />
              ))}
            </SimpleGrid>
          </Stack>
        )}
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
  // [art, locale, slug]
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

  const title = art.title || null
  const description = art.description || null
  const adminUrl = process.env.NEXT_PUBLIC_API_URL
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
  const images = art.images
  const url = `${siteUrl}/${locale}/club/art/${art.slug}`

  const seo = {
    title: art.title,
    description: art.description,
    content: art.content,
    openGraph: {
      title,
      description,
      type: 'article',
      url,
      article: {
        publishedTime: art.publishedAt,
        modifiedTime: art.updatedAt,
        authors: [art.artist.user.username],
        // TODO add tags
      },
      images:
        images?.length > 0
          ? images.map(image => ({
              url: adminUrl + image?.url,
              secureUrl: adminUrl + image?.url,
              type: image?.mime,
              width: image?.width,
              height: image?.height,
              alt: art.title,
            }))
          : [],
    },
  }

  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
      seo,
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 120,
  }
}
