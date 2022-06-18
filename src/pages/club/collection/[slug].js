import { Center, Heading, Image, Spinner, useBreakpointValue, VStack } from '@chakra-ui/react'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useEffect, useState } from 'react'
import { useRef } from 'react'

import { Collection, CollectionItem, Container, Layout } from '~components'
import { getCollection, getCollectionPaths } from '~services'

const CollectionPage = ({ seo, collection }) => {
  const pageShow = useBreakpointValue({ base: 1, lg: 2 })
  const centerRef = useRef(null)
  const [height, setHeight] = useState()
  const [width, setWidth] = useState()
  const [isLoading, setIsloading] = useState(true)

  useEffect(() => {
    if (centerRef.current && pageShow) {
      setTimeout(() => {
        setHeight(centerRef.current.offsetHeight - 60)
        setWidth(centerRef.current.offsetWidth / pageShow - 16)
        setIsloading(false)
      }, 1000)
    }
  }, [centerRef, pageShow])

  if (!collection) return null

  return (
    <Layout seo={seo}>
      <Container minH='inherit'>
        <Center ref={centerRef} py={8} minH='inherit'>
          {isLoading || !height ? (
            <Spinner />
          ) : (
            <Collection
              flipboxProps={{
                height,
                maxHeight: height,
                minHeight: height,
                width,
                minWidth: width,
                maxWidth: width,
              }}
              cover={
                <VStack h='full' justify='center' p={8}>
                  <Image maxH={300} src='/images/kunsthalte.svg' alt='kunsthalte' />
                  <Heading textAlign='center' color='inherit'>
                    Kunsthalte <br /> {collection.title}
                  </Heading>
                </VStack>
              }
              back={<Image maxH='300' mx='auto' src='/images/kunsthalte.svg' alt='kunsthalte' />}
            >
              {collection.arts?.map((art, i) => (
                <CollectionItem
                  key={i}
                  title={art.title}
                  image={process.env.NEXT_PUBLIC_API_URL + art.images[0].url}
                  text={art.description}
                />
              ))}
            </Collection>
          )}
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
