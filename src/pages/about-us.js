import { Box, Heading, Text, VStack } from '@chakra-ui/react'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

import { AnimatedBox, ChakraNextImage, Container, Layout, PageTitle } from '~components'
import { ABOUT_US } from '~data'

const AboutUsBlock = props => {
  const { directing = 'to-right', image, title, text } = props
  return (
    <VStack maxW='lg' align='stretch' overflow='hidden'>
      <AnimatedBox directing={directing} delay={7}>
        <ChakraNextImage h={250} image={image} />
      </AnimatedBox>

      <AnimatedBox directing='to-left' delay={5}>
        <VStack align='stretch' p={4}>
          <Heading as='h3' size='lg'>
            {title}
          </Heading>
          <Text>{text}</Text>
        </VStack>
      </AnimatedBox>
    </VStack>
  )
}

export default function AboutUs({ title, content, seo }) {
  return (
    <Layout seo={seo}>
      <Container>
        <PageTitle>{title}</PageTitle>
        <VStack my={8} spacing={8} align='stretch' maxW='container.md' mx='auto'>
          {content.map(({ title, description, image }, i) => (
            <Box key={i} alignSelf={i % 2 === 0 ? 'start' : 'end'}>
              <AboutUsBlock
                title={title}
                text={description}
                image={image}
                directing={i % 2 === 0 ? 'to-right' : 'to-left'}
              />
            </Box>
          ))}
        </VStack>
      </Container>
    </Layout>
  )
}
export const getStaticProps = async context => {
  const { locale } = context

  const pageData = ABOUT_US[locale]
  const seo = {
    title: pageData.title,
  }
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
      title: pageData.title,
      content: pageData.content,
      seo,
    },
  }
}
