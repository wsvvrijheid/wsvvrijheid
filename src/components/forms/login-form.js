import { Box, Button, Checkbox, Container, Divider, Heading, HStack, Link, Stack, Text } from '@chakra-ui/react'
import { yupResolver } from '@hookform/resolvers/yup'
import axios from 'axios'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import * as React from 'react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'

import { useAuth } from '~hooks'

import { FormItem } from './form-item'
import { OAuthButtonGroup } from './oauth-button-group'

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
    email: yup
      .string()
      .email(t`contact.form.email-invalid`)
      .required(t`login.email.required`),
  })

export const LoginForm = () => {
  useAuth('/profile', true)

  const [errorMessage, setErrorMessage] = useState(null)

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

  const handleSubmitSign = async data => {
    const body = {
      identifier: data.email,
      password: data.password,
    }

    try {
      const resp = await axios.post('/api/auth/login', body)
      if (resp?.data?.error) {
        setErrorMessage(resp?.data?.error?.message)
        setTimeout(() => {
          setErrorMessage('')
          reset()
        }, 2000)
      } else {
        reset()
        router.push('/')
      }
    } catch (error) {
      if (error?.response?.data?.error?.message) {
        setErrorMessage(error?.response?.data?.error?.message)
        setTimeout(() => {
          setErrorMessage('')
        }, 2000)
      } else {
        console.error('An unexpected error happened:', error)
      }
    }
  }

  return (
    <Container maxW='lg' py={{ base: '12', md: '24' }} px={{ base: '0', sm: '8' }}>
      <Stack spacing='8'>
        <Stack spacing='6'>
          <Stack spacing={{ base: '2', md: '3' }} textAlign='center'>
            <Heading>{t('login.sign-in-header.title')}</Heading>
            <HStack spacing='1' justify='center'>
              <Text color='muted'>{t('login.sign-in-header.text')}</Text>
              <Button variant='link' as={Link} href='/user/register' colorScheme='blue'>
                {t('login.sign-in-header.button')}
              </Button>
            </HStack>
          </Stack>
        </Stack>
        <Box py={{ base: '0', sm: '8' }} px={{ base: '4', sm: '10' }} borderRadius={{ base: 'none', sm: 'xl' }}>
          <Stack spacing='6' as='form' onSubmit={handleSubmit(handleSubmitSign)}>
            <Stack spacing='5'>
              {errorMessage && <Text color='red.500'>{errorMessage}</Text>}
              <FormItem id='email' label={t('login.email.title')} type='email' register={register} errors={errors} />
              <FormItem
                id='password'
                type='password'
                label={t('login.password.title')}
                autoComplete='current-password'
                register={register}
                errors={errors}
              />
            </Stack>
            <HStack justify='space-between'>
              <Checkbox defaultIsChecked>{t('login.remember-me')}</Checkbox>
              <Button variant='link' colorScheme='blue' size='sm'>
                {t('login.password.forgot-password')}
              </Button>
            </HStack>
            <Stack spacing='6'>
              <Button type='submit' colorScheme='blue'>
                {t('login.sign-in')}
              </Button>
              <HStack>
                <Divider />
                <Text fontSize='sm' whiteSpace='nowrap' color='muted'>
                  {t('login.sign-in-with')}
                </Text>
                <Divider />
              </HStack>
              <OAuthButtonGroup />
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Container>
  )
}
