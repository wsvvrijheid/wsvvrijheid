import { Button, Container, Heading, Stack } from '@chakra-ui/react'
import { yupResolver } from '@hookform/resolvers/yup'
import axios from 'axios'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import * as React from 'react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'

import { toastMessage } from '~utils'

import { FormItem } from './form-item'

const schema = t =>
  yup.object({
    password: yup
      .string()
      .min(8, t('login.password.warning'))
      .required(t('login.password.required'))
      .matches(RegExp('(.*[a-z].*)'), t('login.password.matches.lowercase'))
      .matches(RegExp('(.*[A-Z].*)'), t('login.password.matches.uppercase'))
      .matches(RegExp('(.*\\d.*)'), t('login.password.matches.number'))
      .matches(RegExp('[!@#$%^&*(),.?":{}|<>]'), t('login.password.matches.special')),
    passwordConfirmation: yup.string().oneOf([yup.ref('password'), null], t('login.password.matches.password-match')),
  })

export const ResetPasswordForm = ({ code }) => {
  const [isLoading, setIsLoading] = useState(false)

  const { t } = useTranslation()
  const router = useRouter()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema(t)),
    mode: 'all',
  })

  const handleSubmitResetPass = async data => {
    setIsLoading(true)
    try {
      const resp = await axios.post('/api/auth/reset-password', {
        code,
        password: data.password,
        passwordConfirmation: data.passwordConfirmation,
      })
      if (resp?.data?.error) {
        toastMessage(t`error`, resp?.data?.error?.message, 'error')
        setTimeout(() => {
          reset()
        }, 2000)
      } else {
        toastMessage(null, t`login.reset-pass-header.text`, 'success')
        reset()
        setTimeout(() => {
          router.push('/user/login')
        }, 2000)
      }
    } catch (error) {
      if (error?.response?.data?.error?.message) {
        toastMessage(t`error`, error?.response?.data?.error?.message, 'error')
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
          <Stack spacing={{ base: '2', md: '3' }} textAlign='center'>
            <Heading>{t('login.reset-pass-header.title')}</Heading>
          </Stack>
        </Stack>
        <Stack spacing='6' as='form' onSubmit={handleSubmit(handleSubmitResetPass)}>
          <Stack spacing='5'>
            <FormItem
              id='password'
              type='password'
              label={t('login.password.title')}
              autoComplete='current-password'
              register={register}
              errors={errors}
            />
            <FormItem
              id='passwordConfirmation'
              type='password'
              label={t('login.password.password-confirm')}
              autoComplete='current-password'
              register={register}
              errors={errors}
            />
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
