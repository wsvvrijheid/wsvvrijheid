import { Box, Center, Flex, Heading, SimpleGrid, Text, VStack } from '@chakra-ui/react'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

import { Container, HomeAbout, HomeHero, HomeProject, Layout } from '~components'
import { HOME_ABOUT, PROJECTS } from '~data'

export default function Home() {
  const { t } = useTranslation()

  return (
    <Layout>
      <Flex
        flexDir='column'
        justify='space-between'
        minH='100vh'
        bg='gray.100'
        mt={{ base: 0, lg: -100 }}
        pt={100}
        pos='relative'
        zIndex={0}
      >
        <Container maxW='container.md' pos='relative' zIndex={1}>
          <VStack flex={1} py={16} spacing={4} textAlign='center'>
            <Heading fontWeight='black'>Wees de Stem voor Vrijheid</Heading>
            <Text fontSize='xl'>{t`home.hero`}</Text>
          </VStack>
        </Container>
        <Box overflow='hidden' mt={-100}>
          <HomeHero />
        </Box>
      </Flex>
      <Center bg='blue.100' py={{ base: 16, lg: 32 }} minH='50vh'>
        <Container>
          <SimpleGrid columns={{ base: 1, lg: 3 }} gap={8} textAlign='center'>
            {HOME_ABOUT.map((item, i) => (
              <HomeAbout key={i} item={item} />
            ))}
          </SimpleGrid>
        </Container>
      </Center>
      {PROJECTS.map((project, i) => (
        <HomeProject key={i} index={i} project={project} />
      ))}
    </Layout>
  )
}

export const getStaticProps = async context => {
  const { locale } = context

  const title = {
    en: 'Homepage',
    tr: 'Anasayfa',
    nl: 'Home',
  }

  const description = {
    en: '',
    tr: '',
    nl: '',
  }

  const seo = {
    title: title[locale],
    description: description[locale],
  }

  return {
    props: {
      seo,
      ...(await serverSideTranslations(locale, ['common'])),
    },
  }
}
