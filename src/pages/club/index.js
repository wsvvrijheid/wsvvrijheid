import {
  Box,
  Center,
  Divider,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerOverlay,
  Grid,
  HStack,
  IconButton,
  Skeleton,
  Stack,
  Text,
  useDisclosure,
  useUpdateEffect,
} from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useState } from 'react'
import { MdCollectionsBookmark, MdMenuOpen } from 'react-icons/md'
import { dehydrate, QueryClient, useQuery } from 'react-query'

import {
  AnimatedBox,
  ArtCard,
  ArtCardSkeleton,
  CategoryFilter,
  CategoryFilterSkeleton,
  Container,
  CreateArtForm,
  Layout,
  MasonryGrid,
  Navigate,
  Pagination,
  SearchForm,
} from '~components'
import { useAuth, useChangeParams } from '~hooks'
import { request } from '~lib'
import { getArts, useArts, useGetArtCategories } from '~services'

const ClubSidebar = ({ categories, isLoading, collections }) => {
  const { t } = useTranslation()
  const { locale } = useRouter()
  return (
    <Stack spacing={8} alignSelf='start'>
      {categories && (
        <Box maxH='calc((100vh - 150px) / 2)'>
          <CategoryFilter categories={categories} isLoading={isLoading} />
        </Box>
      )}

      {collections?.length > 0 && (
        <Box overflowY='auto' maxH='calc((100vh - 150px) / 2)'>
          <HStack py={1.5} w='full' align='center'>
            <Box as={MdCollectionsBookmark} />
            <Text display={{ base: 'none', lg: 'block' }} fontWeight='semibold'>{t`collections`}</Text>
          </HStack>
          <Divider />
          {collections.map((collection, index) => (
            <Navigate target='_blank' key={index} href={`/${locale}/club/collection/${collection.slug}`}>
              <Text py={2} lineHeight='1.15' _hover={{ color: 'blue.400' }}>
                {collection.title}
              </Text>
            </Navigate>
          ))}
        </Box>
      )}
    </Stack>
  )
}

const Club = ({ title }) => {
  const changeParam = useChangeParams()
  const auth = useAuth()
  const { t } = useTranslation()
  const [searchTerm, setSearchTerm] = useState()

  const { isOpen, onOpen, onClose } = useDisclosure()

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

  const collectionsQuery = useQuery({
    queryKey: ['collections', locale],
    queryFn: () =>
      request({
        url: 'api/collections',
        locale,
      }),
  })

  useUpdateEffect(() => {
    artsQuery.refetch()
  }, [searchTerm])

  return (
    <Layout seo={{ title }}>
      <Drawer isOpen={isOpen} onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerBody py={8}>
            <ClubSidebar
              categories={categoryQuery.data}
              collections={collectionsQuery.data?.result}
              isLoading={artsQuery.isLoading}
            />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
      <Container minH='inherit'>
        <Grid w='full' gap={4} my={8} gridTemplateColumns={{ base: '1fr', lg: '200px 1fr' }}>
          <Box display={{ base: 'none', lg: 'block' }}>
            {categoryQuery.isLoading ? (
              <Stack
                direction={{ base: 'row', lg: 'column' }}
                justify='stretch'
                align='center'
                w='full'
                overflowX={{ base: 'auto', lg: 'hidden' }}
                spacing={4}
              >
                <Skeleton h={8} w='full' rounded='md' />
                {Array.from({ length: 5 }).map((_, i) => (
                  <CategoryFilterSkeleton key={'category-filter-skeleton' + i} />
                ))}
              </Stack>
            ) : (
              <ClubSidebar
                categories={categoryQuery.data}
                collections={collectionsQuery.data?.result}
                isLoading={artsQuery.isLoading}
              />
            )}
          </Box>

          <Stack w='full' spacing={4}>
            <HStack>
              <SearchForm placeholder={t`search`} onSearch={setSearchTerm} />
              <CreateArtForm auth={auth} />
              <IconButton
                display={{ base: 'flex', lg: 'none' }}
                variant='outline'
                size='lg'
                aria-label='open-menu'
                icon={<MdMenuOpen />}
                onClick={onOpen}
              />
            </HStack>

            <MasonryGrid gap={1}>
              {artsQuery.isLoading
                ? Array.from({ length: 12 }).map((_, i) => (
                    <ArtCardSkeleton key={'masonry-grid-skeleton' + i} isMasonry />
                  ))
                : artsQuery.data?.result.map((art, i) => (
                    // TODO Add link to navigate to the art page
                    <AnimatedBox key={art.id} directing='to-down' delay={i * 0.5}>
                      <ArtCard art={art} user={auth.user} isMasonry queryKey={queryKey} />
                    </AnimatedBox>
                  ))}
            </MasonryGrid>

            {!artsQuery.isLoading && (
              <Center>
                <Pagination
                  pageCount={artsQuery.data?.pagination.pageCount}
                  currentPage={+page}
                  changeParam={() => changeParam({ page })}
                />
              </Center>
            )}
          </Stack>
        </Grid>
      </Container>
    </Layout>
  )
}

export default Club

export const getStaticProps = async context => {
  const { locale } = context
  const queryClient = new QueryClient()

  await queryClient.prefetchQuery({
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
