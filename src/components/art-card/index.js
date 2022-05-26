import { Avatar, Badge, HStack, IconButton, Stack, Text, useDisclosure } from '@chakra-ui/react'
import { useState } from 'react'
import { FaRegHeart } from 'react-icons/fa'

import { Navigate } from '~components'
import { useLikeArt } from '~services'

import { ArtCardActions } from './actions'
import { ArtCardAlertDialog } from './alert-dialog'
import { ArtCardImage } from './image'

export const ArtCard = ({ art, user, isMasonry, queryKey }) => {
  const [actionType, setActionType] = useState()

  const { isOpen, onOpen, onClose } = useDisclosure()

  const { mutate: likeArt } = useLikeArt(queryKey)

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

      <Stack pos='relative' role='group' w='full'>
        {/* Card Image */}
        <Navigate href={`/club/art/${art.slug}`}>
          <ArtCardImage art={art} isMasonry={isMasonry} />
        </Navigate>
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
        <HStack justify='space-between'>
          <HStack>
            <Avatar
              size='xs'
              src={
                process.env.NEXT_PUBLIC_API_URL +
                // FIXME `formatStrapiData` should be refactored
                (isOwner ? user?.avatar?.formats.thumbnail.url : art.artist.user.avatar?.formats.thumbnail.url)
              }
              name={art.artist.user.username}
            />
            <Text isTruncated>{art.artist.user.username}</Text>
          </HStack>
          <HStack spacing={1}>
            <IconButton
              size='sm'
              isRound
              aria-label='Like art'
              icon={<FaRegHeart />}
              variant='ghost'
              colorScheme='red'
              onClick={() => likeArt({ art })}
            />
            <Text>{art.likes.length}</Text>
          </HStack>
        </HStack>
      </Stack>
    </>
  )
}
