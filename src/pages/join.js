import { Alert, AlertDescription, AlertIcon, AlertTitle, Box, Center, SimpleGrid, VStack } from '@chakra-ui/react'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { dehydrate, QueryClient, useMutation, useQuery } from 'react-query'
import { v4 as uuidV4 } from 'uuid'

import { Container, JoinForm, Layout, PageTitle, ProjectsList } from '~components'
import { mutation, request } from '~lib'
import { toastMessage } from '~utils'

const VolunteersJoin = ({ title }) => {
  const { t } = useTranslation()

  const projectsQuery = useQuery({
    queryKey: 'projects',
    queryFn: () => request({ url: `api/projects` }),
  })

  const projects = projectsQuery.data?.result
  const jobs = projects?.flatMap(p => p.jobs) || []

  const { mutate, isLoading, isSuccess } = useMutation('create-volunteer', data =>
    mutation.post('api/volunteers', { data }),
  )

  const onSubmit = data => {
    try {
      const { availableHours = 0 } = data

      // { key1: true, key2: false, key3: true } => ["key1", "key3"]
      const mapObjToString = obj =>
        Object.entries(obj)
          .filter(([, v]) => v)
          .map(([k]) => k.split('_')[0])

      const heardFrom = mapObjToString(data.heardFrom || {}).join(', ')
      const jobs = mapObjToString(data.jobs)

      mutate(
        {
          ...data,
          username: uuidV4(),
          availableHours,
          heardFrom,
          jobs,
        },
        {
          onError: () => toastMessage(t`apply-form.error.title`, t`apply-form.error.description`, 'error'),
        },
      )
    } catch (error) {
      console.error('Submit volunteer form error', error)
    }
  }

  return (
    <Layout seo={{ title }}>
      <Container>
        {isSuccess ? (
          <Center h='calc(70vh)'>
            <Alert
              status='success'
              colorScheme='blue'
              variant='solid'
              flexDirection='column'
              alignItems='center'
              justifyContent='center'
              textAlign='center'
              py={16}
              w='container.sm'
              shadow='lg'
              rounded='lg'
            >
              <VStack spacing={4}>
                <AlertIcon boxSize='60px' mr={0} />
                <AlertTitle mt={4} mb={1} fontSize='2xl'>
                  {t`apply-form.thanks.title`}
                </AlertTitle>
                <AlertDescription maxWidth='sm'>{t`apply-form.thanks.description`}</AlertDescription>
              </VStack>
            </Alert>
          </Center>
        ) : (
          <>
            <PageTitle>{title}</PageTitle>
            <SimpleGrid mb={8} gap={8} columns={{ base: 1, lg: 2 }} alignItems='start'>
              {/* FORM */}
              <Box>
                <JoinForm onSubmit={onSubmit} isLoading={isLoading} jobs={jobs} projects={projects} />
              </Box>

              {/* PROJECTS */}
              {/* TODO Add ProjectSkeleton */}
              <Box pos='sticky' top={8}>
                {projects && <ProjectsList projects={projects} />}
              </Box>
            </SimpleGrid>
          </>
        )}
      </Container>
    </Layout>
  )
}

export const getStaticProps = async context => {
  const queryClient = new QueryClient()

  await queryClient.prefetchQuery({
    queryKey: 'projects',
    queryFn: () => request({ url: `api/projects` }),
  })

  const seo = {
    title: {
      en: 'Join Us',
      nl: 'Doe Mee',
      tr: 'Bize Katılın',
    },
  }

  return {
    props: {
      ...(await serverSideTranslations(context.locale, ['common'])),
      dehydratedState: dehydrate(queryClient),
      title: seo.title[context.locale],
    },
  }
}

export default VolunteersJoin
