import { Box, Center, HStack, Radio, RadioGroup, SimpleGrid, Stack } from '@chakra-ui/react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Container, Hero, Layout, UserCard } from '~components'
import { request } from '~lib'

export default function Volunteers({ seo, volunteers, jobs }) {
  const [state, setState] = useState()
  const { t } = useTranslation()
  const { locale } = useRouter()

  const data = useMemo(
    () => volunteers.result?.filter(user => (state ? user.jobs?.some(j => j.code === state) : true)),
    [state, volunteers.result],
  )

  return (
    <Layout seo={seo} isDark>
      <Hero title={seo.title} />
      <Container minH='inherit' maxW='container.xl'>
        <HStack pb={8} align='start' spacing={8} my={16}>
          <Box rounded='lg' bg='white' shadow='lg' p={{ base: 4, lg: 8 }}>
            <RadioGroup onChange={setState}>
              <Stack spacing={4} justify='center'>
                <Radio value=''>{t`all`}</Radio>
                {jobs.result.map(job => (
                  <Radio key={job.code} value={job.code}>
                    {job[`name_${locale}`]}
                  </Radio>
                ))}
              </Stack>
            </RadioGroup>
          </Box>
          <SimpleGrid flex={1} columns={{ base: 1, md: 2, lg: 4 }} gap={{ base: 4, lg: 8 }}>
            <Link href='/join' passHref>
              <Stack
                role='group'
                p={6}
                spacing={4}
                rounded='md'
                bg='white'
                w='full'
                shadow='md'
                align='center'
                justify='center'
                cursor='pointer'
                minH={200}
                transition='all 0.3s ease'
                _hover={{ bg: 'blue.500', borderColor: 'white' }}
              >
                <Center
                  color='blue.500'
                  fontWeight='semibold'
                  fontSize='xl'
                  borderWidth={3}
                  borderColor='blue.500'
                  boxSize='full'
                  borderStyle='dashed'
                  transition='all 0.5s ease'
                  bg='white'
                  _groupHover={{ bg: 'blue.100' }}
                >
                  {t`joinTheTeam`}
                </Center>
              </Stack>
            </Link>
            {data?.map((user, i) => (
              <UserCard key={i} user={user} />
            ))}
          </SimpleGrid>
        </HStack>
      </Container>
    </Layout>
  )
}

export const getStaticProps = async context => {
  const volunteers = await request({ url: 'api/volunteers' })
  const jobs = await request({ url: 'api/jobs' })

  const title = {
    en: 'Volunteers',
    nl: 'Vrijwillegers',
    tr: 'Gönüllüler',
  }

  const seo = {
    title: title[context.locale],
  }

  return {
    props: {
      ...(await serverSideTranslations(context.locale, ['common'])),
      volunteers,
      jobs,
      seo,
    },
  }
}
