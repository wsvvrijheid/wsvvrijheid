import {
  Box,
  Button,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Text,
  Textarea,
  useDisclosure,
} from '@chakra-ui/react'
import React, { useRef, useState } from 'react'
import { AiOutlineCloudUpload } from 'react-icons/ai'

import { useAuth } from '~hooks'
import { mutation } from '~lib'

// TODO Consider adding modal form instead of a new page
export const CreateArt = () => {
  const inputFile = useRef(null)
  const auth = useAuth()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [images, setImages] = useState([])
  const [locale, setLocale] = useState('en')
  const [content, setContent] = useState('')
  const { isOpen, onOpen, onClose } = useDisclosure()

  const submitArt = () => {
    const slugify = () => {
      return title
        .trim()
        .toString()
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '')
    }

    const formData = new FormData()

    // TODO add content field (We need to discuss if content field will be markdown)
    // TODO Add locale select input
    // TODO This form shouldn't be available for anonymous users
    // TODO An authenticated user must be an artist in order to create an art
    //      We should add this form (register as an artist) in the future
    // TODO Add success message after creating an art (design should be created on Figma)
    // TODO slug field should be generated automatically (e.g. slugify)
    const data = { locale, title, slug: slugify(), description, content, artist: auth.user?.id }
    formData.append('data', JSON.stringify(data))
    formData.append(`files.images`, images)

    mutation
      .post('api/arts', formData)
      .then(response => console.log(response))
      .catch(err => console.log(err))
  }

  const onDrop = event => {
    // Prevent default behavior (Prevent file from being opened)
    event.preventDefault()

    if (event.dataTransfer.items) {
      // Use DataTransferItemList interface to access the file(s)
      for (var i = 0; i < event.dataTransfer.items.length; i++) {
        // If dropped items aren't files, reject them
        if (event.dataTransfer.items[i].kind === 'file') {
          var file = event.dataTransfer.items[i].getAsFile()
          setImages(prev => [...prev, file])
        }
      }
    } else {
      // Use DataTransfer interface to access the file(s)
      for (var i = 0; i < event.dataTransfer.files.length; i++) {
        setImages(prev => [...prev, event.dataTransfer.files[i]])
      }
    }
  }

  const inputChange = event => {
    const files = [...event.target.files]
    files.forEach(file => setImages(prev => [...prev, file]))
  }

  return (
    <>
      <Button bg={'#3182CE'} onClick={onOpen} disabled={!auth.token || !auth.user}>
        {!auth.token || !auth.user ? 'You are not logged in' : 'Create Art'}
      </Button>

      <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose} size>
        <ModalOverlay />
        <ModalContent
          borderRadius={'10px'}
          fontFamily={'Rubik'}
          w={{ base: '100%', sm: '100%', md: 'fit-content', lg: 'fit-content' }}
        >
          <ModalHeader bg={'#3182CE'} color={'white'} borderRadius={'10px 10px 0 0'}>
            Create Post
          </ModalHeader>
          <ModalCloseButton color={'white'} />
          <ModalBody pb={6} display={'flex'} flexDirection={{ base: 'column', sm: 'column', md: 'row', lg: 'row' }}>
            <Box>
              <Text mb={2} fontWeight={'600'} draggable>
                Upload
              </Text>
              <Input
                type={'file'}
                multiple
                accept={'png jpg'}
                display={'none'}
                ref={inputFile}
                onChange={e => inputChange(e)}
              />
              <Box
                w={{ lg: 400 }}
                h={{ sm: 175, md: 200, lg: 225 }}
                bg={'#EDF2F7'}
                display={'flex'}
                flexDirection={'column'}
                textAlign={'center'}
                color={'#718096'}
                fontSize={'14px'}
                lineHeight={'20px'}
                borderRadius={'10px'}
                border={'1px dashed gray'}
                onClick={() => inputFile.current.click()}
                cursor={'pointer'}
                onDrop={e => onDrop(e)}
                onDragOver={e => e.preventDefault()}
              >
                <AiOutlineCloudUpload style={{ marginTop: 'auto', marginInline: 'auto' }} size={'50'} />
                <Text>Drag & drop files here or click to upload.</Text>
                <Text style={{ marginBottom: 'auto' }}>Supported files: png and jpg</Text>
              </Box>
            </Box>
            <Box ml={{ base: 0, sm: 2, lg: 10 }}>
              <Text mb={2} mt={2} fontWeight={'600'}>
                Locale
              </Text>
              <Select
                w={{ base: '100%', sm: 370, md: 385, lg: 400 }}
                onChange={e => setLocale(e.target.value)}
                value={locale}
              >
                <option value={'en'}>EN (English)</option>
                <option value={'nl'}>NL (Nederlands)</option>
                <option value={'tr'}>TR (Türkçe)</option>
              </Select>
              <Text mb={2} mt={2} fontWeight={'600'}>
                Title
              </Text>
              <Input
                type={'text'}
                placeholder={'Hello'}
                w={{ base: '100%', sm: 370, md: 385, lg: 400 }}
                onChange={e => setTitle(e.target.value)}
                value={title}
              />
              <Text mb={2} mt={2} fontWeight={'600'}>
                Description
              </Text>
              <Textarea
                placeholder={'Description'}
                w={{ base: '100%', sm: 370, md: 385, lg: 400 }}
                onChange={e => setDescription(e.target.value)}
                value={description}
              ></Textarea>
              <Text mb={2} mt={2} fontWeight={'600'}>
                Content
              </Text>
              <Textarea
                placeholder={'Content'}
                w={{ base: '100%', sm: 370, md: 385, lg: 400 }}
                onChange={e => setContent(e.target.value)}
                value={content}
              ></Textarea>
            </Box>
          </ModalBody>

          <ModalFooter>
            <Button onClick={onClose} mr={3}>
              Cancel
            </Button>
            <Button colorScheme='blue' onClick={submitArt}>
              Create +
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
