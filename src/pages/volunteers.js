import { Box, Center, Grid, Radio, RadioGroup, SimpleGrid, Stack, Text } from '@chakra-ui/react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Container, Hero, Layout, UserCard } from '~components'
import { request } from '~lib'
import { useVolunteers } from '~services'

export default function Volunteers({ seo, volunteers, jobs }) {
  const [state, setState] = useState()
  const { t } = useTranslation()
  const { locale } = useRouter()

  const volunteersQuery = useVolunteers(volunteers)

  const data = useMemo(
    () => volunteersQuery.data?.filter(user => (state ? user.jobs?.some(j => j.code === state) : true)),
    [state, volunteersQuery.data],
  )

  return (
    <Layout seo={seo} isDark>
      <Hero title={seo.title} />
      <Container minH='inherit' maxW='container.xl'>
        <Grid
          w='full'
          gap={8}
          py={8}
          gridTemplateColumns={{ base: '1fr', lg: '200px 1fr' }}
          gridTemplateAreas={{
            lg: `
              'jobs volunteers'
            `,
            base: `
              'jobs jobs'
              'volunteers volunteers'
            `,
          }}
        >
          <Box
            rounded='lg'
            bg='white'
            shadow='lg'
            p={{ base: 4, lg: 8 }}
            mb={{ base: 4 }}
            gridArea='jobs'
            position='sticky'
            top={2}
            h={{ base: '56px', lg: 'auto' }}
            overflowX='hidden'
            zIndex='docked'
          >
            <RadioGroup
              position={{ base: 'absolute', lg: 'static' }}
              top={0}
              left={2}
              w='full'
              onChange={setState}
              overflow='hidden'
            >
              <Stack
                spacing={4}
                direction={{ base: 'row', lg: 'column' }}
                justify='stretch'
                w='full'
                overflowX={{ base: 'auto', lg: 'hidden' }}
              >
                <Radio value=''>{t`all`}</Radio>
                {jobs.map(job => (
                  <Radio p={{ base: 4, lg: 'initial' }} key={job.code} value={job.code}>
                    <Text isTruncated>{job[`name_${locale}`]}</Text>
                  </Radio>
                ))}
              </Stack>
            </RadioGroup>
          </Box>
          <SimpleGrid flex={1} columns={{ base: 1, md: 2, lg: 4 }} gap={{ base: 4, lg: 8 }} gridArea='volunteers'>
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
                  textAlign='center'
                >
                  {t`joinTheTeam`}
                </Center>
              </Stack>
            </Link>
            {data?.map((user, i) => (
              <UserCard key={i} user={user} />
            ))}
          </SimpleGrid>
        </Grid>
      </Container>
    </Layout>
  )
}

export const getStaticProps = async context => {
  const volunteersResponse = await request({ url: 'api/volunteers', filters: { approved: { $eq: true } } })
  const jobsResponse = await request({ url: 'api/jobs' })

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
      volunteers: volunteersResponse.result,
      jobs: jobsResponse.result,
      seo,
    },
    revalidate: 120,
  }
}
