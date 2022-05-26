import { Button, Container, Heading, Stack } from '@chakra-ui/react'
import { yupResolver } from '@hookform/resolvers/yup'
import axios from 'axios'
import { useTranslation } from 'next-i18next'
import * as React from 'react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'

import { toastMessage } from '~utils'

import { FormItem } from './form-item'

const schema = t =>
  yup.object({
    email: yup
      .string()
      .email(t`contact.form.email-invalid`)
      .required(t`login.email.required`),
  })

export const ForgotPasswordForm = () => {
  const [isLoading, setIsLoading] = useState(false)
  const { t } = useTranslation()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema(t)),
    mode: 'all',
  })

  const handleSubmitSign = async data => {
    const body = {
      email: data.email,
    }
    setIsLoading(true)

    try {
      const resp = await axios.post('/api/auth/forgot-password', body)
      if (resp?.data?.error) {
        toastMessage(t`error`, resp?.data?.error?.message, 'error')
      } else {
        toastMessage(null, t`login.forgot-pass-header.text`, 'success')
        reset()
      }
    } catch (error) {
      if (error?.response?.data?.error?.message) {
        toastMessage(t`error`, t`apply-form.error.description`, 'error')
      } else {
        console.error('An unexpected error happened:', error)
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Container maxW='lg' py={{ base: '12', md: '24' }} px={{ base: '0', sm: '8' }}>
      <Stack spacing='8' shadow='lg' bg='white' p={{ base: 8, lg: 12 }} rounded='lg'>
        <Stack spacing='6'>
          <Stack spacing={{ base: '', md: '3' }} textAlign='center'>
            <Heading>{t('login.forgot-pass-header.title')}</Heading>
          </Stack>
        </Stack>
        <Stack spacing='6' as='form' onSubmit={handleSubmit(handleSubmitSign)}>
          <Stack spacing='5'>
            <FormItem id='email' label={t('login.email.title')} type='email' register={register} errors={errors} />
          </Stack>
          <Stack spacing='6'>
            <Button type='submit' colorScheme='blue' isLoading={isLoading}>
              {t('login.forgot-pass-header.button')}
            </Button>
          </Stack>
        </Stack>
      </Stack>
    </Container>
  )
}
