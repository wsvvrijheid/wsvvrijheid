import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
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
  Text,
  Textarea,
  useDisclosure,
  VStack,
} from '@chakra-ui/react'
import { yupResolver } from '@hookform/resolvers/yup'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { FaPlus, FaUpload } from 'react-icons/fa'
import { useMutation, useQueryClient } from 'react-query'
import * as yup from 'yup'

import { Navigate } from '~components'
import { mutation } from '~lib'
import { slugify, toastMessage } from '~utils'

import { FileUploader } from './file-uploader'
import { FormItem } from './form-item'

const ArtCreateSuccessAlert = ({ isOpen, onClose }) => {
  const { t } = useTranslation()

  return (
    <AlertDialog closeOnOverlayClick={false} isCentered isOpen={isOpen} onClose={onClose}>
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader bg='green.500' color='white' fontSize='lg' fontWeight='bold'>
            {t`art.create.success.title`}
          </AlertDialogHeader>

          <AlertDialogBody py={4}>
            <Text>{t`art.create.success.description`}</Text>
            <Navigate as={Button} colorScheme='blue.500' href='/profile'>
              {t`art.create.success.link`}
            </Navigate>
          </AlertDialogBody>

          <AlertDialogFooter>
            <Button onClick={onClose}>{t`dismiss`}</Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  )
}

const schema = t =>
  yup.object({
    locale: yup.string().required(t`art.create.form.locale-required`),
    title: yup.string().required(t`art.create.form.title-required`),
    description: yup.string().required(t`art.create.form.description-required`),
    content: yup.string().required(t`art.create.form.content-required`),
  })

// TODO Consider adding modal form instead of a new page
export const CreateArtForm = ({ auth }) => {
  const [images, setImages] = useState([])
  const queryClient = useQueryClient()
  const formDisclosure = useDisclosure()
  const successDisclosure = useDisclosure()

  const { locale } = useRouter()

  const { t } = useTranslation()
  const {
    register,
    formState: { errors, isValid },
    reset,
    handleSubmit,
  } = useForm({ resolver: yupResolver(schema(t)), mode: 'all' })

  const createArtMutation = useMutation({
    mutationKey: 'create-art',
    mutationFn: data => mutation.post('api/arts', data),
    onSuccess: () => {
      reset()
      formDisclosure.onClose()
      successDisclosure.onOpen()
      setImages([])
      queryClient.invalidateQueries(['arts', auth.user.username])
    },
    onError: error => {
      console.error('error.response', error.response)
      toastMessage('Error creating art', error.message, 'error')
    },
  })

  const createArtistMutation = useMutation({
    mutationKey: 'create-artist',
    mutationFn: () => mutation.post('api/artists', { data: { user: auth.user.id } }),
    onSuccess: () => auth.updateSession(),
  })

  const onCreateArtist = () => {
    createArtistMutation.mutate()
  }

  useEffect(
    () => () => {
      // Make sure to revoke the data uris to avoid memory leaks
      images.forEach(image => URL.revokeObjectURL(image.preview))
    },
    [images],
  )

  const handleCreateArt = async data => {
    const formData = new FormData()

    // TODO add content field (We need to discuss if content field will be markdown)
    // TODO An authenticated user must be an artist in order to create an art
    //      We should add this form (register as an artist) in the future
    const art = { ...data, slug: slugify(data.title), artist: auth.user.artist?.id }
    formData.append('data', JSON.stringify(art))
    images.forEach(image => formData.append(`files.images`, image, image.name))

    createArtMutation.mutate(formData)
  }

  if (!auth.isLoggedIn) return null

  return (
    <>
      <Button colorScheme='blue' leftIcon={<FaUpload />} onClick={formDisclosure.onOpen}>
        {t`art.upload`}
      </Button>

      {/* SUCCESS ALERT */}
      <ArtCreateSuccessAlert isOpen={successDisclosure.isOpen} onClose={successDisclosure.onClose} />

      <Modal
        isCentered
        closeOnOverlayClick={false}
        isOpen={formDisclosure.isOpen}
        onClose={formDisclosure.onClose}
        size={auth.user.artist ? '4xl' : 'md'}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader bg='blue.500' color={'white'}>
            {t`art.upload`}
          </ModalHeader>
          <ModalCloseButton color={'white'} />
          <ModalBody pos='relative' py={6}>
            {/* LOADING */}
            {(createArtMutation.isLoading || createArtistMutation.isLoading) && (
              <Center zIndex={1} pos='absolute' top={0} left={0} boxSize='full' bg='whiteAlpha.900'>
                <Spinner size='xl' colorScheme='blue' />
              </Center>
            )}

            {/* CREATE FORM */}
            {auth.user.artist && (
              <SimpleGrid columns={{ base: 1, lg: 2 }} gap={4}>
                <FileUploader setImages={setImages} images={images} />
                <Stack spacing={4} as='form' onSubmit={handleSubmit(handleCreateArt)}>
                  <FormControl>
                    <FormLabel fontSize='sm' htmlFor='locale' mb={2} mt={2} fontWeight={'600'}>
                      {t`language`}
                    </FormLabel>
                    <Select defaultValue={locale} {...register('locale')} id='locale'>
                      <option value={'en'}>EN (English)</option>
                      <option value={'nl'}>NL (Nederlands)</option>
                      <option value={'tr'}>TR (Türkçe)</option>
                    </Select>
                  </FormControl>
                  <FormItem id='title' label={t`title`} isRequired errors={errors} register={register} />
                  <FormItem
                    id='description'
                    label={t`description`}
                    as={Textarea}
                    isRequired
                    errors={errors}
                    register={register}
                  />
                  <FormItem
                    id='content'
                    label={t`content`}
                    as={Textarea}
                    isRequired
                    errors={errors}
                    register={register}
                  />
                  <ButtonGroup alignSelf='end'>
                    <Button onClick={formDisclosure.onClose} mr={3}>
                      {t`cancel`}
                    </Button>
                    <Button
                      isDisabled={!images || images?.length === 0 || !isValid}
                      type='submit'
                      colorScheme='blue'
                      rightIcon={<FaPlus />}
                    >
                      {t`create`}
                    </Button>
                  </ButtonGroup>
                </Stack>
              </SimpleGrid>
            )}

            {/* ARTIST CONFIRMATION */}
            {!auth.user.artist && (
              <VStack spacing={8}>
                <Text textAlign='center'>{t`art.create.artist-confirmation.text`}</Text>
                <ButtonGroup>
                  <Button onClick={formDisclosure.onClose}>{t`cancel`}</Button>
                  <Button colorScheme='blue' onClick={onCreateArtist}>
                    {t`art.create.artist-confirmation.button`}
                  </Button>
                </ButtonGroup>
              </VStack>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}
