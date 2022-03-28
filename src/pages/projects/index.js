import { Container, SimpleGrid } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

import { Card, Layout, PageTitle } from '~components'
import { request } from '~lib'

export default function Projects({ title, projects }) {
  const { locale } = useRouter()
  return (
    <Layout scrollHeight={100} seo={{ title }}>
      <Container maxW='container.lg' centerContent>
        <PageTitle>{title}</PageTitle>
        <SimpleGrid columns={{ base: 1, md: 2 }} gap={{ base: 6, lg: 8 }} mb={16}>
          {projects.result.map(project => (
            <Card
              key={project.id}
              title={project[`name_${locale}`]}
              description={project[`description_${locale}`]}
              image={project.image.url}
              link={project.link}
            />
          ))}
        </SimpleGrid>
      </Container>
    </Layout>
  )
}
export const getStaticProps = async context => {
  const { locale } = context
  const projects = await request({ url: 'api/projects' })

  const seo = {
    title: {
      en: 'Projects',
      nl: 'Projecten',
      tr: 'Projeler',
    },
  }
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
      title: seo.title[locale],
      projects,
    },
  }
}
