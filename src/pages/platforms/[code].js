import { Box, Button, Center, Heading, Spinner, Stack } from '@chakra-ui/react'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { serialize } from 'next-mdx-remote/serialize'
import { FaChevronRight } from 'react-icons/fa'

import { ChakraNextImage, Container, Layout, Markdown, Navigate } from '~components'
import { getProject, getProjectPaths } from '~services'

const ProjectDetailPage = ({ seo, source, image, link }) => {
  if (!source) return <Spinner />

  return (
    <Layout seo={seo}>
      <Container maxW='container.md'>
        <Stack py={8} spacing={8}>
          <ChakraNextImage ratio='twitter' image={image} rounded='lg' />
          <Heading textAlign='center'>{seo.title}</Heading>
          <Box textAlign={{ base: 'left', lg: 'justify' }}>
            <Markdown source={source} />
          </Box>
          <Center>
            {!!link && (
              <Navigate href={link} as={Button} colorScheme='blue' size='lg' rightIcon={<FaChevronRight />}>
                {link}
              </Navigate>
            )}
          </Center>
        </Stack>
      </Container>
    </Layout>
  )
}
export default ProjectDetailPage

export const getStaticPaths = async () => {
  const paths = await getProjectPaths()

  return {
    paths,
    fallback: true,
  }
}

export const getStaticProps = async context => {
  const locale = context.locale
  const code = context.params?.code

  const project = await getProject(code)

  if (!project) return { notFound: true }

  const title = project[`name_${locale}`]
  const description = project[`description_${locale}`]
  const content = project[`content_${locale}`]
  const image = project.image
  const link = project.link

  const seo = {
    title,
    description,
    content,
  }

  const source = await serialize(content || '')

  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
      seo,
      image,
      link,
      source,
    },
    revalidate: 1,
  }
}
