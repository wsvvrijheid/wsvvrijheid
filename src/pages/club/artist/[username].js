import { Avatar, SimpleGrid, SkeletonCircle, SkeletonText, Stack, Text } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { dehydrate, QueryClient } from 'react-query'

import { ArtCard, ArtCardSkeleton, Container, Hero, Layout } from '~components'
import { useAuth } from '~hooks'
import { getArtist, getArtistsPaths, useGetArtist } from '~services'

const ArtistPage = ({ title }) => {
  const { user } = useAuth()

  const {
    query: { username },
    locale,
  } = useRouter()

  const { data: artist, isLoading } = useGetArtist(locale, username)

  return (
    <Layout seo={{ title }} isDark>
      <Hero>
        <Stack align='center' cursor='default' userSelect='none'>
          {isLoading ? (
            <SkeletonCircle size={16} />
          ) : (
            <Avatar
              size='lg'
              src={`${process.env.NEXT_PUBLIC_API_URL}${artist?.user.avatar?.formats.thumbnail.url}`}
              name={artist?.name || artist?.user.username}
            />
          )}
          {isLoading ? (
            <SkeletonText noOfLines={1} w={32} />
          ) : (
            <Text color={'white'}>{artist?.name || artist?.user.username}</Text>
          )}
        </Stack>
      </Hero>
      <Container>
        <SimpleGrid m={4} gap={8} columns={{ base: 1, md: 2, lg: 4 }}>
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => <ArtCardSkeleton key={i} />)
            : artist.arts?.map(art => <ArtCard key={art.id} art={art} user={user} />)}
        </SimpleGrid>
      </Container>
    </Layout>
  )
}

export default ArtistPage

export const getStaticPaths = async () => {
  const paths = await getArtistsPaths()
  return {
    paths,
    fallback: true,
  }
}

export const getStaticProps = async context => {
  const { locale, params } = context
  const queryClient = new QueryClient()

  await queryClient.prefetchQuery({
    queryKey: ['artist', locale, params.username],
    queryFn: () => getArtist(locale, params.username),
  })

  const artist = queryClient.getQueryData(['artist', locale, params.username])

  if (!artist)
    return {
      notFound: true,
    }

  // TODO Provide available seo props (description, image, etc.)
  const seo = {
    title: params.username || null,
  }

  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
      title: seo.title,
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 1,
  }
}
