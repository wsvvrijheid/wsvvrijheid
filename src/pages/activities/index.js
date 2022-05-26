import { Container, SimpleGrid } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

import { Card, Hero, Layout, Pagination } from '~components'
import { request } from '~lib'

export default function Activities({ activities, query, title }) {
  const { locale } = useRouter()

  return (
    <Layout seo={{ title }} isDark>
      <Hero title={title} />
      <Container maxW='container.lg' centerContent>
        <SimpleGrid columns={{ base: 1, md: 2 }} gap={{ base: 6, lg: 8 }} my={16}>
          {activities.result.map(activity => (
            <Card
              key={activity.id}
              title={activity.title}
              description={activity.content}
              image={activity.image.url}
              link={`/${locale}/activities/${activity.slug}`}
              isExternal={false}
            />
          ))}
        </SimpleGrid>
        <Pagination
          pageCount={activities.pagination.pageCount}
          currentPage={+query.page}
          changeParam={() => changeParam({ page })}
        />
      </Container>
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
      activities,
    },
  }
}
