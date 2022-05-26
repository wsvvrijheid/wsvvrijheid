import { Avatar, SimpleGrid, Stack, Text } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { dehydrate, QueryClient } from 'react-query'

import { ArtCard, Container, Hero, Layout } from '~components'
import { useAuth } from '~hooks'
import { getArtistsPaths, getArts, useArts } from '~services'

const ArtistPage = ({ title }) => {
  const { user } = useAuth()

  const {
    query: { username },
    locale,
  } = useRouter()

  const artsQuery = useArts(['arts', locale, username], { locale, username })
  const arts = artsQuery?.data?.result

  const artist = arts?.[0].artist

  return (
    <Layout seo={{ title }}>
      <Hero image='/images/auth-profile-bg.avif'>
        <Stack align='center'>
          <Avatar
            size='lg'
            src={`${process.env.NEXT_PUBLIC_API_URL}${
              artist?.user.data.attributes.avatar?.data.attributes.formats.thumbnail.url ||
              artist?.user.data.attributes.avatar?.data.attributes.url
            }`}
            name={artist?.user.data.attributes.username}
          />
          <Text color={'white'}>{artist?.user.data.attributes.username}</Text>
        </Stack>
      </Hero>
      <Container>
        <SimpleGrid m={4} gap={8} columns={{ base: 1, md: 2, lg: 4 }}>
          {arts?.map(art => (
            <ArtCard key={art.id} art={art} user={user} />
          ))}
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

  const artist = await getArts({ locale, username: params.username })

  if (!artist)
    return {
      notFound: true,
    }

  queryClient.prefetchQuery({
    // See: `useGetArt` (services/art/find-one.js)
    // [arts, locale, slug]
    queryKey: ['arts', locale, params.username],
    queryFn: () => getArts({ locale, username: params.username }),
  })

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
  }
}
