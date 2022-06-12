import { Avatar, Badge, Box, HStack, IconButton, Stack, Text, useDisclosure, useMediaQuery } from '@chakra-ui/react'
import { useState } from 'react'
import { AiFillHeart } from 'react-icons/ai'
import { GoLinkExternal } from 'react-icons/go'

import { Navigate } from '~components'
import { useLikeArt } from '~services'

import { ArtCardActions } from './actions'
import { ArtCardAlertDialog } from './alert-dialog'
import { ArtCardImage } from './image'

export const ArtCard = ({ art, user, isMasonry, queryKey }) => {
  const [actionType, setActionType] = useState()

  const { isOpen, onOpen, onClose } = useDisclosure()

  const { toggleLike, isLiked } = useLikeArt(art, user, queryKey)

  const isOwner = user?.id === art.artist.user.id

  const onHandleAction = type => {
    setActionType(type)
    onOpen()
  }

  return (
    <>
      {/* Card Action Alert Dialog */}
      {actionType && (
        <ArtCardAlertDialog art={art} actionType={actionType} isOpen={isOpen} onClose={onClose} queryKey={queryKey} />
      )}

      <Stack pos='relative' role='group' w='full' overflow='hidden' userSelect='none'>
        {/* Card Image */}
        <ArtCardImage art={art} isMasonry={isMasonry} />

        {/* Card Owner Actions */}
        {isOwner && <ArtCardActions art={art} onHandleAction={onHandleAction} />}

        {!art.publishedAt && (
          <Badge userSelect='none' pos='absolute' top={0} left={2}>
            Draft
          </Badge>
        )}

        {/* Card Body */}
        {/* TODO Show link button when hover on card */}
        {/* TODO Navigate to `/club/art/:slug` page */}

        <Box
          display={{ base: 'none', lg: 'block' }}
          position={{ base: 'static', lg: 'absolute' }}
          bottom={2}
          h='full'
          left='-150%'
          right={0}
          w='full'
          _groupHover={{ left: 0 }}
          transition='all 0.2s ease-in-out'
          bgGradient='linear(to-t, blackAlpha.700, transparent, transparent, blackAlpha.700)'
        />

        {!isOwner && (
          <HStack
            position='absolute'
            top={{ base: 2, lg: '-150%' }}
            right={{ base: 2, lg: '-150%' }}
            w='full'
            _groupHover={{ top: 2, right: 2 }}
            transition='all 0.2s'
            justify='end'
          >
            <HStack spacing={1}>
              <Text fontSize={{ base: 'md', lg: 'sm' }} fontWeight={600} color='white'>
                {(art?.likes || 0) + (art.likers?.length || 0)}
              </Text>
              <IconButton
                size='sm'
                rounded='full'
                aria-label='like post'
                color={isLiked ? 'red.400' : 'gray.500'}
                // colorScheme={{ base: 'gray', lg: 'whiteAlpha' }}
                icon={<AiFillHeart />}
                onClick={toggleLike}
              />
            </HStack>
            <Navigate href={`/club/art/${art.slug}`}>
              <IconButton size='sm' rounded='full' aria-label='view art' colorScheme='blue' icon={<GoLinkExternal />} />
            </Navigate>
          </HStack>
        )}

        <HStack
          align='center'
          pos={{ base: 'absolute', lg: 'static' }}
          bottom={0}
          w='full'
          bgGradient='linear(to-t, blackAlpha.700, transparent)'
          p={{ base: 2, lg: 0 }}
          pt={{ base: 12, lg: 0 }}
        >
          <Stack
            position={{ base: 'static', lg: 'absolute' }}
            bottom={'-150%'}
            w='full'
            _groupHover={{ bottom: 2 }}
            transition='all 0.2s'
            fontSize={{ base: 'md', lg: 'sm' }}
            color='white'
            spacing={0}
            fontWeight={600}
          >
            <Text
              p={2}
              pb={0}
              display={{ base: 'none', lg: 'block' }}
              {...(useMediaQuery({ lg: true }) && { noOfLines: 2 })}
            >
              {art.title}
            </Text>
            <Navigate href={`/club/artist/${art.artist.user.username}`}>
              <HStack
                m={1}
                p={1}
                rounded='lg'
                w='max-content'
                borderWidth={1}
                borderColor='transparent'
                _hover={{ bg: 'whiteAlpha.300', borderColor: 'whiteAlpha.500' }}
              >
                <Avatar
                  size='xs'
                  src={
                    process.env.NEXT_PUBLIC_API_URL +
                    // FIXME `formatStrapiData` should be refactored
                    (isOwner ? user?.avatar?.formats.thumbnail.url : art.artist.user.avatar?.formats.thumbnail.url)
                  }
                  name={art.artist.name || art.artist.user.username}
                />
                <Text isTruncated>{art.artist.name || art.artist.user.username}</Text>
              </HStack>
            </Navigate>
          </Stack>
        </HStack>
      </Stack>
    </>
  )
}
