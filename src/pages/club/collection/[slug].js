import { Center, Spinner, useBreakpointValue } from '@chakra-ui/react'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useEffect, useState } from 'react'
import { useRef } from 'react'

import { Collection, Container, Layout } from '~components'
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
        setWidth(centerRef.current.offsetWidth)
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
                minHeight: height,
                width: width / pageShow,
                minWidth: width / pageShow,
              }}
              collection={collection}
            />
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
