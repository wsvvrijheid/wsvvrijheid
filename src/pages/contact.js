import { Box, Button, Divider, Heading, Link, SimpleGrid, Stack, Text, VStack, Wrap } from '@chakra-ui/react'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'react-i18next'
import { MdEmail, MdLocationOn, MdPhone } from 'react-icons/md'

import { ContactForm, Container, Layout, SocialButtons } from '~components'

const Contact = ({ seo }) => {
  const { t } = useTranslation()

  return (
    <Layout seo={seo}>
      <Box minH='inherit'>
        <Container minH='inherit'>
          <SimpleGrid my={{ base: 8, lg: 0 }} gap={8} alignContent='center' columns={{ base: 1, lg: 2 }} minH='inherit'>
            <VStack
              bg='blue.900'
              color='blue.50'
              borderRadius='lg'
              p={{ base: 8, lg: 12 }}
              textAlign='center'
              justify='space-evenly'
              spacing={8}
            >
              <Heading fontWeight={900} as='h2' size='lg' color='blue.200'>
                STICHTING <br /> WEES DE STEM VOOR VRIJHEID
              </Heading>
              <Divider borderColor='whiteAlpha.400' />

              <Wrap spacing={4} justify='center'>
                <Button
                  as={Link}
                  isExternal
                  variant='link'
                  color='blue.50'
                  _hover={{ color: 'blue.200' }}
                  leftIcon={<Box as={MdPhone} color='blue.200' size='20px' />}
                  href='tel:+31685221308'
                >
                  +31-6 85221308
                </Button>
                <Button
                  as={Link}
                  isExternal
                  variant='link'
                  color='blue.50'
                  _hover={{ color: 'blue.200' }}
                  leftIcon={<Box as={MdEmail} color='blue.200' size='20px' />}
                  href='mailto:info@wsvvrijheid.nl'
                >
                  info@wsvvrijheid.nl
                </Button>
                <Button
                  as={Link}
                  isExternal
                  variant='link'
                  color='blue.50'
                  _hover={{ color: 'blue.200' }}
                  leftIcon={<Box as={MdLocationOn} color='blue.200' size='20px' />}
                  href='https://goo.gl/maps/E9HaayQnXmphUWtN8'
                  textAlign='left'
                >
                  Tandersplein 1, 3027 CN, Rotterdam
                </Button>
              </Wrap>

              <SocialButtons />

              <Stack w='full' spacing={4}>
                <Stack w='full'>
                  <Text color='blue.200' fontWeight={600}>
                    {t('wsvvrijheid.management')}
                  </Text>
                  <Wrap justify='space-around' spacing={4}>
                    <Box>
                      <Text fontSize='sm'> {t('wsvvrijheid.chairman')}</Text>
                      <Text>Sümeyye Ateş</Text>
                    </Box>
                    <Box>
                      <Text fontSize='sm'>{t('wsvvrijheid.treasurer')}</Text>
                      <Text>Davut Dur</Text>
                    </Box>
                  </Wrap>
                </Stack>
                <Divider borderColor='whiteAlpha.400' />
                <Wrap justify='space-around' fontSize='sm' textAlign='left'>
                  <Text>KVK: 85680621</Text>
                  <Text>RSIN: 863705571 </Text>
                </Wrap>
              </Stack>
            </VStack>

            <Stack rounded='lg' p={{ base: 8, lg: 16 }} shadow='lg' spacing={4}>
              <Stack>
                <Heading size='lg'>{t('contact.title')}</Heading>
                <Text fontSize='sm'>{t('contact.fill-form')}</Text>
              </Stack>
              <Divider />
              <ContactForm />
            </Stack>
          </SimpleGrid>
        </Container>
      </Box>
    </Layout>
  )
}

export default Contact

export const getStaticProps = async context => {
  const { locale } = context

  const title = {
    en: 'Contact',
    tr: 'İletişim',
    nl: 'Contact',
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
