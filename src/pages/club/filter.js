import { Flex, Image, SimpleGrid, Spinner, Text } from '@chakra-ui/react'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import React, { useEffect, useState } from 'react'
import { AiFillHome } from 'react-icons/ai'
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
      <Text display={'flex'} alignItems={'center'} margin={'15px'} as='button'>
        <AiFillHome />
        Home
      </Text>
      <Text fontSize={'2xl'} marginLeft={'15px'} marginBottom={'10px'}>
        {title}
      </Text>
      <SimpleGrid columns={1} spacing={10} width={'20%'}>
        {isLoading ? (
          <Spinner thickness='4px' speed='0.65s' emptyColor='gray.200' color='blue.500' size='xl' />
        ) : (
          data?.result.map((item, index) => (
            <Flex
              key={'category' + index}
              as='button'
              borderRadius='md'
              px={4}
              h={8}
              onClick={() => setCategory(item.code)}
              justifyContent={'start'}
              alignItems={'center'}
            >
              <Image
                borderRadius='full'
                boxSize='35px'
                src='https://bit.ly/dan-abramov'
                alt='Dan Abramov'
                marginRight={'5px'}
              />
              {item['name_' + locale]}
            </Flex>
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
