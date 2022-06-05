import {
  Box,
  Button,
  chakra,
  Checkbox,
  FormLabel,
  Heading,
  HStack,
  Stack,
  Switch,
  Text,
  Textarea,
  Wrap,
} from '@chakra-ui/react'
import { yupResolver } from '@hookform/resolvers/yup'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import React from 'react'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'

import { FormItem } from './form-item'

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
    name: yup.string().required(t`apply-form.name.required`),
    email: yup
      .string()
      .email(t`apply-form.email.invalid`)
      .required(t`apply-form.email.required`),
    phone: yup.string().required(t`apply-form.phone.required`),
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

export const JoinForm = ({ onSubmit, isLoading, jobs, projects }) => {
  const { locale } = useRouter()
  const { t } = useTranslation()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(generateSchema(t, jobs)),
    mode: 'onTouched',
  })

  return (
    <Stack p={8} bg='white' rounded='lg' shadow='md' as='form' spacing={4} onSubmit={handleSubmit(onSubmit)}>
      <Heading as='h3' size='lg' textAlign='center' fontWeight='black'>
        {t`apply-form.title`}
      </Heading>
      <Stack direction={{ base: 'column', md: 'row' }} spacing={4}>
        <FormItem register={register} id='name' errors={errors} label={t`apply-form.name.input`} isRequired />
        <FormItem register={register} id='email' errors={errors} label={t`apply-form.email.input`} isRequired />
      </Stack>
      <Stack direction={{ base: 'column', md: 'row' }} spacing={4}>
        <FormItem register={register} id='phone' errors={errors} label={t`apply-form.phone.input`} isRequired />
        <FormItem
          type='number'
          register={register}
          id='availableHours'
          errors={errors}
          label={t`apply-form.available-hours.input`}
          defaultValue={1}
          isRequired
        />
      </Stack>
      <FormItem register={register} id='occupation' label={t`apply-form.occupation`} />
      <FormItem as={Textarea} register={register} id='comment' label={t`apply-form.comment`} />

      <Stack justify='space-between' direction={{ base: 'column', md: 'row' }}>
        <HStack>
          <Switch id='in-mailing-list' {...register('inMailingList')} />
          <FormLabel htmlFor='in-mailing-list'>{t`apply-form.in-mailing-list`}</FormLabel>
        </HStack>
        <HStack>
          <Switch id='is-public' {...register('isPublic')} />
          <FormLabel htmlFor='is-public'>{t`apply-form.show-in-website`}</FormLabel>
        </HStack>
      </Stack>

      {/* heard FROM */}
      <Box>
        <FormLabel fontSize='sm' fontWeight='semibold'>{t`apply-form.heard-from`}</FormLabel>
        <Wrap p={4} spacing={4} rounded='lg' borderWidth={2} borderColor={errors.heardFrom ? 'red.400' : 'gray.100'}>
          {heardFrom.map(item => (
            <HStack key={item.value}>
              <Checkbox id={item.value} {...register(`heardFrom[${item.value}]`)} />
              <FormLabel textTransform='capitalize' htmlFor={item.value}>
                {item.label[locale]}
              </FormLabel>
            </HStack>
          ))}
        </Wrap>
      </Box>

      {/* JOBS */}
      <Box>
        <FormLabel fontSize='sm' fontWeight='semibold'>
          {t`apply-form.jobs.title`} <chakra.span color='red.500'>*</chakra.span>
        </FormLabel>
        <Stack spacing={8} rounded='lg' p={4} borderWidth={2} borderColor={errors.jobs ? 'red.500' : 'gray.100'}>
          {projects?.map((project, i) => (
            <Stack key={i}>
              <Text fontWeight='semibold' fontSize='sm'>
                {project[`name_${locale}`]}
              </Text>
              {project.jobs.map(job => (
                <HStack key={job.id}>
                  <Checkbox id={job.id} {...register(`jobs[${job.id}_${job.code}]`)} />
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
  )
}
