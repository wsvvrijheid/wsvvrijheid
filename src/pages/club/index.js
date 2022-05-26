import { Box, HStack, Stack, useUpdateEffect } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useState } from 'react'
import { dehydrate, QueryClient } from 'react-query'

import {
  ArtCard,
  ArtCardSkeleton,
  CategoryFilter,
  CategoryFilterSkeleton,
  Container,
  Layout,
  MasonryGrid,
  Pagination,
  SearchForm,
} from '~components'
import { useAuth, useChangeParams } from '~hooks'
import { getArts, useArts, useGetArtCategories } from '~services'

const Club = ({ title }) => {
  const changeParam = useChangeParams()
  const { user } = useAuth()
  const { t } = useTranslation()
  const [searchTerm, setSearchTerm] = useState()

  const {
    query: { page, categories },
    locale,
  } = useRouter()

  const categoryQuery = useGetArtCategories(locale)

  // As mentioned in `getStaticProps`, we need to keep the same order for queryKey
  // queryKey = [arts, locale, searchTerm, category, page]
  const queryKey = ['arts', locale, searchTerm, categories || null, page || '1']

  // Custom useQuery hook or fetching arts
  const artsQuery = useArts(queryKey, {
    url: 'api/arts',
    categories,
    searchTerm,
    page,
    locale,
  })

  useUpdateEffect(() => {
    artsQuery.refetch()
  }, [searchTerm])

  return (
    // TODO Remove `isLoading` condition from the `Layout` and
    // create skeleton components for both the `MasonryGrid` and the `CategoryFilter`
    <Layout seo={{ title }}>
      <Container minH='inherit'>
        <HStack py={8} align='start' spacing={8} minH='inherit'>
          <Box w={200}>
            {categoryQuery.isLoading || !categoryQuery.isFetched ? (
              Array.from({ length: 3 }).map((_, i) => <CategoryFilterSkeleton key={'category-filter-skeleton' + i} />)
            ) : (
              <CategoryFilter categories={categoryQuery.data} />
            )}
          </Box>
          <Stack spacing={4} flex={1} alignSelf='stretch'>
            <SearchForm placeholder={t`club.arts.search`} onSearch={setSearchTerm} />

            <Stack flex={1} justify='space-between' w='full'>
              <MasonryGrid gap={4}>
                {artsQuery.isLoading
                  ? Array.from({ length: 12 }).map((_, i) => (
                      <ArtCardSkeleton isMasonry key={'masonry-grid-skeleton' + i} />
                    ))
                  : artsQuery.data?.result.map(art => (
                      // TODO Add link to navigate to the art page
                      <ArtCard key={art.id} art={art} user={user} isMasonry queryKey={queryKey} />
                    ))}
              </MasonryGrid>

              {!artsQuery.isLoading && (
                <Box alignSelf='center'>
                  <Pagination
                    pageCount={artsQuery.data?.pagination.pageCount}
                    currentPage={+page}
                    changeParam={() => changeParam({ page })}
                  />
                </Box>
              )}
            </Stack>
          </Stack>
        </HStack>
      </Container>
    </Layout>
  )
}

export default Club

export const getStaticProps = async context => {
  const { locale } = context
  const queryClient = new QueryClient()

  queryClient.prefetchQuery({
    // We will be using `queryKey` in nested components especially invalidate queries after mutations
    // So, we need to keep the same order of the `queryKey` array

    // queryKey: [arts, locale, searchTerm, category, page]
    queryKey: ['arts', '', locale, null, '1'],
    queryFn: () => getArts({ locale }),
  })

  const seo = {
    title: {
      en: 'Art Club',
      nl: 'Kunst Club',
      tr: 'Sanat Kulübü',
    },
  }
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
      title: seo.title[locale],
      dehydratedState: dehydrate(queryClient),
    },
  }
}
