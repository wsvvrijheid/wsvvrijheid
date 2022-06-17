import { Center, Heading, Image, Stack, Text, VStack } from '@chakra-ui/react'
import dynamic from 'next/dynamic'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { forwardRef } from 'react'

import { Container, Layout } from '~components'
import { getCollection, getCollectionPaths } from '~services'

const FlipBook = dynamic(() => import('../../../components/shared/flip-book'), { ssr: false })

// eslint-disable-next-line react/display-name
const Page = forwardRef((props, ref) => {
  return (
    <Stack ref={ref} {...props}>
      {props.children}
    </Stack>
  )
})

const CollectionPage = ({ seo, collection }) => {
  if (!collection) return null

  return (
    <Layout seo={seo}>
      <Container>
        <Center py={8}>
          <FlipBook
            width={550}
            height={733}
            size='stretch'
            minWidth={315}
            maxWidth={1000}
            minHeight={420}
            maxHeight={1350}
            maxShadowOpacity={0.5}
            showCover={true}
          >
            <VStack p={8} shadow='inner' bg='red.100' borderColor='black' borderWidth={2} rounded='md'>
              <Image src='/images/kunsthalte.svg' alt='kunsthalte' />
              <Heading textAlign='center' color='red.500'>
                Kunsthalte <br /> {collection.title}
              </Heading>
            </VStack>
            {collection.arts?.map(art => (
              <Page
                key={art.id}
                borderWidth={1}
                borderColor='blackAlpha.200'
                rounded='md'
                shadow='inner'
                spacing={4}
                p={8}
                bg='gray.50'
              >
                <Heading textAlign='center' color='red.500' size='md' as='h2'>
                  {art.title}
                </Heading>

                <Image
                  maxH={{ base: 300, md: 400, lg: 500 }}
                  w='full'
                  objectFit='contain'
                  src={process.env.NEXT_PUBLIC_API_URL + art.images[0].url}
                  alt={art.title}
                  rounded='lg'
                />

                <Text flex={1} noOfLines={3}>
                  {art.description} {art.description} {art.description} {art.description} {art.description}
                  {art.description} {art.description} {art.description} {art.description} {art.description}
                </Text>
              </Page>
            ))}
            <VStack p={8} shadow='inner' bg='red.100' borderColor='black' borderWidth={2} rounded='md'>
              <Image src='/images/kunsthalte.svg' alt='kunsthalte' />
              <Heading textAlign='center' color='red.500'>
                Kunsthalte <br /> {collection.title}
              </Heading>
            </VStack>
          </FlipBook>
        </Center>
      </Container>
    </Layout>
  )
}
export default CollectionPage

export const getStaticPaths = async context => {
  const paths = await getCollectionPaths(context.locales)

  return {
    paths,
    fallback: true,
  }
}

export const getStaticProps = async context => {
  const locale = context.locale

  const slug = context.params?.slug

  const collection = await getCollection(locale, slug)

  if (!collection) return { notFound: true }

  const slugs =
    collection.localizations?.reduce((acc, l) => {
      acc[l.locale] = l.slug
      return acc
    }, {}) || {}

  const title = collection.title || null

  const seo = {
    title,
  }

  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
      seo,
      slugs: { ...slugs, [locale]: slug },
      collection,
    },
  }
}
