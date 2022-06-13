import { Box, Button, Grid, Radio, RadioGroup, Stack, Text } from '@chakra-ui/react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { IoPeopleCircle } from 'react-icons/io5'

import { Container, Hero, Layout, MasonryGrid, UserCard } from '~components'
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
        <Grid w='full' gap={{ base: 4, lg: 8 }} py={8} gridTemplateColumns={{ base: '1fr', lg: 'max-content 1fr' }}>
          <Box
            m={-2}
            p={2}
            spacing={{ base: 4, lg: 8 }}
            w='calc(100% + 16px)'
            overflow='hidden'
            position='sticky'
            top={2}
            zIndex='docked'
          >
            <Link href='/join' passHref>
              <Button
                position={{ base: 'fixed', lg: 'static' }}
                bottom={0}
                rounded={{ base: 0, lg: 'md' }}
                left={0}
                w='full'
                size='lg'
                shadow='md'
                py={8}
                mb={{ base: 0, lg: 8 }}
                leftIcon={
                  <Box fontSize='3xl'>
                    <IoPeopleCircle />
                  </Box>
                }
                colorScheme='blue'
              >{t`joinTheTeam`}</Button>
            </Link>

            <Box rounded='md' bg='white' shadow='md' p={{ base: 4, lg: 8 }} overflowX='hidden'>
              <RadioGroup w='full' onChange={setState} overflow='hidden'>
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
          </Box>
          <MasonryGrid flex={1} columns={[1, 2, 3, 4]} gap={{ base: 4, lg: 8 }}>
            {data?.map((user, i) => (
              <UserCard key={i} user={user} />
            ))}
          </MasonryGrid>
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
