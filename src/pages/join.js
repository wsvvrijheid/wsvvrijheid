import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Center,
  Checkbox,
  FormLabel,
  Heading,
  HStack,
  SimpleGrid,
  Stack,
  Switch,
  Text,
  Textarea,
  useToast,
  VStack,
  Wrap,
} from '@chakra-ui/react'
import { yupResolver } from '@hookform/resolvers/yup'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { forwardRef } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation } from 'react-query'
import * as yup from 'yup'

import { Container, FormItem, Layout, PageTitle, ProjectsList } from '~components'
import { mutation, request } from '~lib'

// FIXME Need to change type in backend as well
const heardFrom = [
  {
    label: {
      en: 'Whatsapp',
      nl: 'Whatsapp',
      tr: 'Whatsapp',
    },
    value: 'whatsapp',
    selected: false,
  },
  {
    label: {
      en: 'Email',
      nl: 'Email',
      tr: 'Email',
    },
    value: 'mail',
    selected: false,
  },
  {
    label: {
      en: 'Friend',
      nl: 'Vrienden',
      tr: 'Arkadaş',
    },
    value: 'friends',
    selected: false,
  },
  {
    label: {
      en: 'Web',
      nl: 'Web',
      tr: 'Internet',
    },
    value: 'web',
    selected: false,
  },
  {
    label: {
      en: 'Other',
      nl: 'Anders',
      tr: 'Diğer',
    },
    value: 'other',
    selected: false,
  },
]

function generateSchema(t, jobs) {
  yup.addMethod(yup.object, 'atLeastOneRequired', function (list, message) {
    return this.test({
      name: 'atLeastOneRequired',
      message,
      exclusive: true,
      params: { keys: list.join(', ') },
      test: value => value == null || list.some(f => !!value[`${f.id}_${f.code}`]),
    })
  })

  return yup.object().shape({
    fullname: yup.string().required(t`apply-form.name.required`),
    email: yup
      .string()
      .email(t`apply-form.email.invalid`)
      .required(t`apply-form.email.required`),
    phone: yup.string(),
    occupation: yup.string(),
    comment: yup.string(),
    inMailingList: yup.boolean(),
    isPublic: yup.boolean(),
    availableHours: yup
      .number()
      .min(1)
      .max(40)
      .required(t`apply-form.available-hours.required`),
    heardFrom: yup.object().shape(
      heardFrom.reduce((acc, h) => {
        acc[h] = yup.bool()
        return acc
      }, {}),
    ),
    jobs: yup
      .object()
      .shape(
        jobs.reduce((acc, h) => {
          acc[h] = yup.bool()
          return acc
        }, {}),
      )
      .atLeastOneRequired(jobs, t`apply-form.jobs.required`),
  })
}

const SwitchForm = forwardRef(function SwitchForm(props, ref) {
  return <Switch ref={ref} {...props} />
})

const CheckboxForm = forwardRef(function CheckboxForm(props, ref) {
  return <Checkbox ref={ref} {...props} />
})

const VolunteersJoin = ({ title, projects, jobs }) => {
  const { t } = useTranslation()
  const { locale } = useRouter()
  const toast = useToast()

  const { mutate, isLoading, isSuccess } = useMutation('create-volunteer', data =>
    mutation.post('api/volunteers', { data }),
  )

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(generateSchema(t, jobs)),
    mode: 'onTouched',
  })

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
      console.log('data', data)
      mutate(
        {
          ...data,
          name: data.fullname,
          username: Math.floor(Math.random() * 10 ** 6).toString(),
          availableHours,
          heardFrom,
          jobs,
          publishedAt: null,
        },
        {
          onError: () =>
            toast({
              status: 'error',
              title: t`apply-form.error.title`,
              description: t`apply-form.error.description`,
              position: 'top-right',
              isClosable: true,
              duration: 5000,
            }),
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

              <Stack p={8} bg='white' rounded='lg' shadow='md' as='form' spacing={4} onSubmit={handleSubmit(onSubmit)}>
                <Heading as='h3' size='lg' textAlign='center' fontWeight='black'>
                  {t`apply-form.title`}
                </Heading>
                <Stack direction={{ base: 'column', md: 'row' }} spacing={4}>
                  <FormItem register={register} id='fullname' errors={errors} label={t`apply-form.name.input`} />
                  <FormItem register={register} id='email' errors={errors} label={t`apply-form.email.input`} />
                </Stack>
                <Stack direction={{ base: 'column', md: 'row' }} spacing={4}>
                  <FormItem register={register} id='phone' errors={errors} label={t`apply-form.phone.input`} />
                  <FormItem
                    type='number'
                    register={register}
                    id='availableHours'
                    errors={errors}
                    label={t`apply-form.available-hours.input`}
                    defaultValue={1}
                  />
                </Stack>
                <FormItem register={register} id='occupation' label={t`apply-form.occupation`} />
                <FormItem as={Textarea} register={register} id='comment' label={t`apply-form.comment`} />

                <Stack justify='space-between' direction={{ base: 'column', md: 'row' }}>
                  <HStack>
                    <SwitchForm id='in-mailing-list' {...register('inMailingList')} />
                    <FormLabel htmlFor='in-mailing-list'>{t`apply-form.in-mailing-list`}</FormLabel>
                  </HStack>
                  <HStack>
                    <SwitchForm id='is-public' {...register('isPublic')} />
                    <FormLabel htmlFor='is-public'>{t`apply-form.show-in-website`}</FormLabel>
                  </HStack>
                </Stack>

                {/* heard FROM */}
                <Box>
                  <FormLabel fontSize='sm' fontWeight='semibold'>{t`apply-form.heard-from`}</FormLabel>
                  <Wrap
                    p={4}
                    spacing={4}
                    rounded='lg'
                    borderWidth={2}
                    borderColor={errors.heardFrom ? 'red.400' : 'gray.100'}
                  >
                    {heardFrom.map(item => (
                      <HStack key={item.value}>
                        <CheckboxForm id={item.value} {...register(`heardFrom[${item.value}]`)} />
                        <FormLabel textTransform='capitalize' htmlFor={item.value}>
                          {item.label[locale]}
                        </FormLabel>
                      </HStack>
                    ))}
                  </Wrap>
                </Box>

                {/* JOBS */}
                <Box>
                  <FormLabel fontSize='sm' fontWeight='semibold'>{t`apply-form.jobs.title`}</FormLabel>
                  <Stack
                    spacing={8}
                    rounded='lg'
                    p={4}
                    borderWidth={2}
                    borderColor={errors.jobs ? 'red.500' : 'gray.100'}
                  >
                    {projects.result.map((project, i) => (
                      <Stack key={i}>
                        <Text fontWeight='semibold' fontSize='sm'>
                          {project[`name_${locale}`]}
                        </Text>
                        {project.jobs.map(job => (
                          <HStack key={job.id}>
                            <CheckboxForm id={job.id} {...register(`jobs[${job.id}_${job.code}]`)} />
                            <FormLabel textTransform='capitalize' htmlFor={job.id}>
                              {job[`name_${locale}`]}
                            </FormLabel>
                          </HStack>
                        ))}
                      </Stack>
                    ))}
                    {errors.jobs && (
                      <Text fontSize='sm' color='red.500'>
                        {errors.jobs.message}
                      </Text>
                    )}
                  </Stack>
                </Box>
                <Button isLoading={isLoading} colorScheme='blue' size='lg' type='submit'>{t`apply-form.submit`}</Button>
              </Stack>

              {/* PROJECTS */}
              <ProjectsList projects={projects.result} />
            </SimpleGrid>
          </>
        )}
      </Container>
    </Layout>
  )
}

export const getStaticProps = async context => {
  const projects = await request({ url: 'api/projects' })

  const jobs = projects.result?.flatMap(p => p.jobs) || []

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
      title: seo.title[context.locale],
      projects,
      jobs,
    },
  }
}

export default VolunteersJoin
