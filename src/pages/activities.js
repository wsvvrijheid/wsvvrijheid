import { Container, SimpleGrid } from '@chakra-ui/react'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

import { Card, Layout, PageTitle,PagePagination } from '~components'
import { request } from '~lib'

export default function Activities({ header, activities }) {
  return (
    <Layout scrollHeight={100} seo={{ header }}>
      <Container maxW='container.lg' centerContent>
        <PageTitle>{header}</PageTitle>
        <SimpleGrid columns={{ base: 1, md: 2 }} gap={{ base: 6, lg: 8 }} mb={16}>
          {activities?.result.map(activity => (
            <Card
              key={activity.id}
              title={activity.title}
              description={activity.content}
              image={activity.image.url}
              link={activity.link}
            />
          ))}
        </SimpleGrid>
        <PagePagination subpage={activities} header={header} />
      </Container>
    </Layout>
  )
}
export const getServerSideProps = async (context) => {
  const { locale } = context
  const page=context.query.page
  const pageSize=10
  
  const activities = await request({ locale, url: 'api/activities',page, pageSize })

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
      header: seo.title[locale],
      activities,
    },
  }
}
