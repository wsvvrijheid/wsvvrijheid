import { Alert, AlertDescription, AlertIcon, Button, Textarea, VStack } from '@chakra-ui/react'
import { yupResolver } from '@hookform/resolvers/yup'
import axios from 'axios'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { BsPerson } from 'react-icons/bs'
import { MdEmail } from 'react-icons/md'
import * as yup from 'yup'

import { FormItem } from './form-item'

const schema = t =>
  yup.object({
    fullname: yup.string().required(t`contact.form.fullname-required`),
    email: yup
      .string()
      .email(t`contact.form.email-invalid`)
      .required(t`contact.form.email-required`),
    message: yup.string().required(t`contact.form.message-required`),
  })

export const ContactForm = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isError, setIsError] = useState(false)
  const { t } = useTranslation()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(schema(t)),
    mode: 'all',
  })

  const onSubmit = async data => {
    const emailData = {
      to: process.env.NEXT_PUBLIC_EMAIL_BASE,
      from: process.env.NEXT_PUBLIC_EMAIL_FROM,
      subject: `Form from ${data.fullname} (${data.email})`,
      text: data.message,
    }
    try {
      setIsLoading(true)
      axios.post(`${process.env.NEXT_PUBLIC_API_URL}/email`, emailData)
    } catch (error) {
      setIsError(true)
      setIsSuccess(false)
    } finally {
      setIsLoading(false)
      setIsSuccess(true)
      reset()
    }
  }

  return (
    <VStack spacing={5} as='form' onSubmit={handleSubmit(onSubmit)}>
      <FormItem
        id='fullname'
        label={t('contact.form.fullname-label')}
        leftElement={<BsPerson color='gray.800' />}
        errors={errors}
        register={register}
      />
      <FormItem
        id='email'
        type='email'
        label='Email'
        leftElement={<MdEmail color='gray.200' />}
        helperText={t`contact.form.email-helper`}
        errors={errors}
        register={register}
      />
      <FormItem
        as={Textarea}
        id='message'
        label={t('contact.form.message-label')}
        errors={errors}
        register={register}
      />

      <Button variant='solid' colorScheme='blue' type='submit' isDisabled={!isValid} isLoading={isLoading} w='full'>
        {t`contact.form.button`}
      </Button>

      {isSuccess && (
        <Alert status='success'>
          <AlertIcon />
          <AlertDescription>{t('contact.form.message-delivered')}</AlertDescription>
        </Alert>
      )}
      {isError && (
        <Alert status='error'>
          <AlertIcon />
          <AlertDescription>{t('contact.form.failed')}</AlertDescription>
        </Alert>
      )}
    </VStack>
  )
}
