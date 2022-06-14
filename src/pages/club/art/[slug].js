import { Box, Grid, Heading, SimpleGrid, Stack } from '@chakra-ui/react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { dehydrate, QueryClient } from 'react-query'

import { ArtCard, ArtContent, ArtDetail, Container, Layout } from '~components'
import { useAuth } from '~hooks'
import { getArt, getArtPaths, useGetArt, useViewArt } from '~services'

const CommentsComp = dynamic(() => import('../../../components/shared/comment'), { ssr: false })

const ArtPage = ({ seo, queryKey }) => {
  const auth = useAuth()
  const { t } = useTranslation()

  const {
    query: { slug },
  } = useRouter()

  const { data: art } = useGetArt()
  useViewArt()

  if (!art) return null

  return (
    <Layout seo={seo}>
      <Container minH='inherit' my={8}>
        {/* TODO Create skeleton components for ArtDetail ArtContent and Comments */}

        <Grid pos='relative' gridTemplateColumns={{ base: '1fr', lg: '3fr 2fr' }} gap={4} alignItems='start'>
          {/* Single Art Images */}
          <Box pos={{ lg: 'sticky' }} top={0}>
            <ArtDetail art={art} user={auth.user} queryKey={queryKey} />
          </Box>

          <Stack spacing={4}>
            {/* Single Art Content */}
            <ArtContent art={art} />
            {/* Single Art Comments */}
            <Stack spacing={4}>
              {/*  Comment form */}
              <CommentsComp page={slug} />
            </Stack>
          </Stack>
        </Grid>

        {/* Other Arts List */}
        {art.arts?.length > 0 && (
          <Stack justify='space-between' w='full' mt={8} spacing={8}>
            <Heading as='h3' size='lg'>
              {t`art.others`}
            </Heading>
            {/* TODO Add ArtCardSkeleton for loading state. */}
            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap={8}>
              {art.arts.map(art => (
                <ArtCard key={art.id} art={art} queryKey={queryKey} />
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

  const slugs =
    art.localizations?.reduce((acc, l) => {
      acc[l.locale] = l.slug
      return acc
    }, {}) || {}

  const title = art.title || null
  const description = art.description || null
  const adminUrl = process.env.NEXT_PUBLIC_API_URL
  const images = art.images

  const seo = {
    title: art.title,
    description: art.description,
    content: art.content,
    openGraph: {
      title,
      description,
      type: 'article',
      url: art.url,
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
      queryKey,
      slugs: { ...slugs, [locale]: art.slug },
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 120,
  }
}
