import {
  Box,
  Button,
  FormControl,
  FormLabel,
  HStack,
  Image,
  Input,
  SimpleGrid,
  Stack,
  Text,
  VStack,
} from '@chakra-ui/react'
import { useTranslation } from 'next-i18next'
import React from 'react'
import { AiOutlineCloudUpload } from 'react-icons/ai'
import { GrClearOption } from 'react-icons/gr'

import { resizeImage } from '~utils'

export const FileUploader = ({ images, setImages, maxSize }) => {
  const inputRef = React.useRef(null)
  const [previews, setPreviews] = React.useState([])

  const { t } = useTranslation()

  const onInputChange = async event => {
    const files = [...event.target.files]
    const compressedFiles = await Promise.all(files.map(file => resizeImage({ file, maxSize })))

    console.log('compressedFiles', compressedFiles)

    compressedFiles.forEach(file => {
      setImages(prev => [...prev, file])
      setPreviews(prev => [...prev, URL.createObjectURL(file)])
    })
  }

  const sizes = images.reduce((acc, curr) => acc + curr.size, 0)

  const onDrop = event => {
    // Prevent default behavior (Prevent file from being opened)
    event.preventDefault()

    if (event.dataTransfer.items) {
      // Use DataTransferItemList interface to access the file(s)
      for (let i = 0; i < event.dataTransfer.items.length; i++) {
        // If dropped items aren't files, reject them
        if (event.dataTransfer.items[i].kind === 'file') {
          const file = event.dataTransfer.items[i].getAsFile()
          setImages(prev => [...prev, file])
          setPreviews(prev => [...prev, URL.createObjectURL(file)])
        }
      }
    } else {
      // Use DataTransfer interface to access the file(s)
      for (let i = 0; i < event.dataTransfer.files.length; i++) {
        const file = event.dataTransfer.files[i]
        setImages(prev => [...prev, { ...file, preview: URL.createObjectURL(file) }])
      }
    }
  }

  return (
    <Stack>
      <FormControl>
        <FormLabel htmlFor='form-input' mb={2} fontWeight={'600'}>
          {t`upload.label`}
        </FormLabel>
        <Input
          id='form-input'
          accept='image/png, image/jpeg, image/jpeg, image/webp'
          type={'file'}
          multiple
          display={'none'}
          ref={inputRef}
          onChange={onInputChange}
        />
        <VStack
          h={250}
          bg='gray.100'
          textAlign={'center'}
          justify='center'
          fontSize='sm'
          borderRadius='md'
          border={'1px dashed gray'}
          onClick={() => inputRef.current.click()}
          cursor={'pointer'}
          onDrop={e => onDrop(e)}
          onDragOver={e => e.preventDefault()}
        >
          {previews?.length > 0 ? (
            <SimpleGrid w='full' columns={2} overflowY='auto' p={2} gap={2}>
              {previews.map((preview, i) => (
                <Image boxSize='full' objectFit='contain' key={i} src={preview} alt={preview.name} />
              ))}
            </SimpleGrid>
          ) : (
            <>
              <Box as={AiOutlineCloudUpload} boxSize={50} />
              <Text>{t`upload.description`}</Text>
              <Text>{t`upload.support`}</Text>
            </>
          )}
        </VStack>
      </FormControl>
      <HStack w='full' justify='space-between'>
        {images.length > 0 && (
          <Text>
            {images.length} images, {(sizes / 1000000).toFixed(2)}MB
          </Text>
        )}
        <Button
          leftIcon={<GrClearOption />}
          ml='auto'
          onClick={() => {
            setImages([])
            setPreviews([])
          }}
        >
          {t`clear`}
        </Button>
      </HStack>
    </Stack>
  )
}
