import { Avatar, Button, HStack, IconButton, Stack, Text, Textarea, useBreakpointValue, VStack } from '@chakra-ui/react'
import { yupResolver } from '@hookform/resolvers/yup'
import { useTranslation } from 'next-i18next'
import React from 'react'
import { useForm } from 'react-hook-form'
import { FiArrowRight } from 'react-icons/fi'
import { useMutation, useQueryClient } from 'react-query'
import * as yup from 'yup'

import { mutation } from '~lib'
import { toastMessage } from '~utils'

import { FormItem } from './form-item'

const userSchema = t =>
  yup.object({
    content: yup.string().required(t`comment-form.content.required`),
  })

const publicSchema = t =>
  yup.object({
    name: yup.string().required(t`comment-form.name.required`),
    email: yup
      .string()
      .email(t`comment-form.email.invalid`)
      .required(t`comment-form.email.required`),
    content: yup.string().required(t`comment-form.content.required`),
  })

export const CommentForm = ({ auth, art }) => {
  const { t } = useTranslation()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(auth.isLoggedIn ? userSchema(t) : publicSchema(t)),
    mode: 'all',
  })

  const queryClient = useQueryClient()

  const { mutate: createComment, isLoading } = useMutation({
    mutationKey: 'create-comment',
    mutationFn: ({ content, name, email }) => {
      if (auth.isLoggedIn) {
        return mutation.post(`api/comments`, {
          data: { content, art: art.id, user: auth.user.id },
        })
      }

      return mutation.post(`api/comments`, {
        data: {
          content,
          name,
          email,
          art: art.id,
        },
      })
    },
    onSuccess: () => {
      toastMessage(t`comment-form.success`, null, 'success')
      queryClient.invalidateQueries(['art', art.locale, art.slug])
      reset()
    },
  })

  const onSubmit = async data => {
    createComment(data)
  }

  return (
    <Stack spacing={4} p={4} boxShadow='base' borderRadius='sm' bg='white'>
      <Text textAlign='left' fontSize='16px' fontWeight='semibold' textTransform='capitalize'>
        {t('apply-form.comment-placeholder')}
      </Text>
      <VStack as='form' onSubmit={handleSubmit(onSubmit)} alignItems='flex-start' justify='flex-start'>
        <Stack w='100%' alignItems='flex-start'>
          {!auth.isLoggedIn && (
            <Stack direction={{ base: 'column', lg: 'row' }} w='full'>
              <FormItem
                id='name'
                hideLabel
                label={t('comment-form.name.placeholder')}
                register={register}
                errors={errors}
              />
              <FormItem
                id='email'
                type='email'
                hideLabel
                label={t('comment-form.email.placeholder')}
                register={register}
                errors={errors}
              />
            </Stack>
          )}
          <HStack w='full' align='start'>
            {auth.isLoggedIn && <Avatar size='sm' src={`${auth.user?.avatar?.url}`} name={auth.user?.username} />}
            <FormItem
              as={Textarea}
              id='content'
              hideLabel
              label={t('comment-form.content.placeholder')}
              register={register}
              errors={errors}
              {...useBreakpointValue({ base: { rows: 1 }, sm: { rows: 3 } })}
            />
            <IconButton
              display={{ base: 'flex', sm: 'none' }}
              colorScheme='blue'
              aria-label='Send Comment'
              icon={<FiArrowRight />}
              isRound
              isLoading={isLoading}
              isDisabled={!isValid}
              type='submit'
            />
          </HStack>
        </Stack>
        <Button
          display={{ base: 'none', sm: 'flex' }}
          alignSelf='flex-end'
          colorScheme='blue'
          rightIcon={<FiArrowRight />}
          isLoading={isLoading}
          isDisabled={!isValid}
          type='submit'
        >
          {t('comment-form.send')}
        </Button>
      </VStack>
    </Stack>
  )
}
