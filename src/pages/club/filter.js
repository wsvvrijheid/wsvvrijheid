import { Button, SimpleGrid, Spinner } from '@chakra-ui/react'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import React, { useEffect, useState } from 'react'
import { useQuery } from 'react-query'

import { request } from '~lib'

const Filter = ({ title, locale }) => {
  const { data, isLoading } = useQuery('categories', () => request({ url: 'api/categories', populate: '' }))
  const [category, setCategory] = useState(null)
  const [arts, setArts] = useState(null)

  useEffect(() => {
    category
      ? request({ url: 'api/arts', populate: '', filters: { categories: { code: { $eq: category } } } })
          .then(data => {
            setArts(data)
          })
          .catch(err => console.log(err))
      : request({ url: 'api/arts', populate: '' })
          .then(data => {
            setArts(data)
          })
          .catch(err => console.log(err))
  }, [category])

  console.log(arts)

  return (
    <div>
      <h2>{title}</h2>
      <SimpleGrid columns={1} spacing={10} width={'20%'}>
        {isLoading ? (
          <Spinner thickness='4px' speed='0.65s' emptyColor='gray.200' color='blue.500' size='xl' />
        ) : (
          data?.result.map((item, index) => (
            <Button key={'category' + index} bg='lightgray' height='80px' onClick={() => setCategory(item.code)}>
              {item['name_' + locale]}
            </Button>
          ))
        )}
      </SimpleGrid>
    </div>
  )
}

export const getStaticProps = async context => {
  const categories = await request({ url: 'api/categories' })

  const seo = {
    title: {
      en: 'Category',
      nl: 'Categorie',
      tr: 'Kategori',
    },
  }
  return {
    props: {
      ...(await serverSideTranslations(context.locale, ['common'])),
      title: seo.title[context.locale],
      locale: context.locale,
      categories,
    },
  }
}

export default Filter
