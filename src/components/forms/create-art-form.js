import {
  Button,
  ButtonGroup,
  Center,
  FormControl,
  FormLabel,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Select,
  SimpleGrid,
  Spinner,
  Stack,
  Textarea,
} from '@chakra-ui/react'
import { yupResolver } from '@hookform/resolvers/yup'
import { useTranslation } from 'next-i18next'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { FaPlus } from 'react-icons/fa'
import { useMutation, useQueryClient } from 'react-query'
import * as yup from 'yup'

import { mutation } from '~lib'
import { slugify, toastMessage } from '~utils'

import { FileUploader } from './file-uploader'
import { FormItem } from './form-item'

const schema = t =>
  yup.object({
    locale: yup.string().required(t`art.create.form.require-locale`),
    title: yup.string().required(t`art.create.form.require-title`),
    description: yup.string().required(t`art.create.form.require-description`),
    content: yup.string().required(t`art.create.form.require-content`),
  })

// TODO Consider adding modal form instead of a new page
export const CreateArtForm = ({ user, isOpen, onClose }) => {
  const [images, setImages] = useState([])
  const queryClient = useQueryClient()

  const { t } = useTranslation()
  const {
    register,
    formState: { errors },
    reset,
    handleSubmit,
  } = useForm({ resolver: yupResolver(schema(t)), mode: 'all' })

  const { mutate: createArt, isLoading } = useMutation({
    mutationKey: 'create-art',
    mutationFn: data => mutation.post('api/arts', data),
    onSuccess: () => {
      toastMessage('Art created successfully', '', 'success')
      onClose()
      reset()
      setImages([])
      queryClient.invalidateQueries(['arts', user.username])
    },
    onError: error => {
      console.error('error.response', error.response)
      toastMessage('Error creating art', error.message, 'error')
    },
  })

  useEffect(
    () => () => {
      // Make sure to revoke the data uris to avoid memory leaks
      images.forEach(image => URL.revokeObjectURL(image.preview))
    },
    [images],
  )

  const handleCreate = async data => {
    const formData = new FormData()

    // TODO add content field (We need to discuss if content field will be markdown)
    // TODO An authenticated user must be an artist in order to create an art
    //      We should add this form (register as an artist) in the future
    const art = { ...data, slug: slugify(data.title), artist: user.artist?.id }
    formData.append('data', JSON.stringify(art))
    images.forEach(image => formData.append(`files.images`, image, image.name))

    createArt(formData)
  }

  return (
    <Modal isCentered closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose} size='4xl'>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader bg='blue.500' color={'white'}>
          {t`art.create.header`}
        </ModalHeader>
        <ModalCloseButton color={'white'} />
        <ModalBody pos='relative' py={6} as={SimpleGrid} columns={{ base: 1, lg: 2 }} gap={4}>
          <FileUploader setImages={setImages} images={images} />
          {isLoading && (
            <Center zIndex={1} pos='absolute' top={0} left={0} boxSize='full' bg='whiteAlpha.900'>
              <Spinner size='xl' colorScheme='blue' />
            </Center>
          )}
          <Stack spacing={4} as='form' onSubmit={handleSubmit(handleCreate)}>
            <FormControl>
              <FormLabel htmlFor='locale' mb={2} mt={2} fontWeight={'600'}>
                {t`art.create.locale`}
              </FormLabel>
              <Select {...register('locale')} id='locale'>
                <option value={'en'}>EN (English)</option>
                <option value={'nl'}>NL (Nederlands)</option>
                <option value={'tr'}>TR (Türkçe)</option>
              </Select>
            </FormControl>
            <FormItem id='title' label={t`art.create.title`} errors={errors} register={register} />
            <FormItem
              id='description'
              label={t`art.create.description`}
              as={Textarea}
              isRequired
              errors={errors}
              register={register}
            />
            <FormItem
              id='content'
              label={t`art.create.content`}
              as={Textarea}
              isRequired
              errors={errors}
              register={register}
            />
            <ButtonGroup alignSelf='end'>
              <Button onClick={onClose} mr={3}>
                Cancel
              </Button>
              <Button type='submit' colorScheme='blue' rightIcon={<FaPlus />}>
                Create
              </Button>
            </ButtonGroup>
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
