import { Container, Image, SimpleGrid, Stack, Text } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

import { AnimatedBox, Card, Hero, Layout, Pagination } from '~components'
import { request } from '~lib'

export default function Activities({ activities, query, title, pagination }) {
  const { locale } = useRouter()

  return (
    <Layout seo={{ title }} isDark>
      <Hero title={title} />
      {activities?.[0] ? (
        <>
          <Container maxW='container.lg' centerContent>
            <SimpleGrid columns={{ base: 1, md: 2 }} gap={{ base: 6, lg: 8 }} my={16}>
              {activities?.map((activity, i) => (
                <AnimatedBox directing='to-down' delay={i * 3} key={activity.id}>
                  <Card
                    title={activity.title}
                    description={activity.description}
                    image={activity.image.url}
                    link={`/${locale}/activities/${activity.slug}`}
                    isExternal={false}
                  />
                </AnimatedBox>
              ))}
            </SimpleGrid>
            <Pagination
              pageCount={pagination.pageCount}
              currentPage={+query.page}
              changeParam={() => changeParam({ page })}
            />
          </Container>
        </>
      ) : (
        <Stack minH='inherit' justify='center' align='center' spacing={8}>
          <Image h={200} src='/images/no-blog.svg' alt='no blog' />
          <Text textAlign='center' fontSize='lg'>
            Sorry! No activities published in this language.
          </Text>
        </Stack>
      )}
    </Layout>
  )
}
export const getServerSideProps = async context => {
  const { locale, query } = context
  const { page } = query

  const activities = await request({
    url: 'api/activities',
    page,
    pageSize: 10,
    locale,
  })

  const seo = {
    title: {
      en: 'Activities',
      nl: 'Activiteiten',
      tr: 'Faaliyetler',
    },
  }

  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
      title: seo.title[locale],
      query: context.query,
      activities: activities.result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
      pagination: activities.pagination,
    },
    revalidate: 120,
  }
}
