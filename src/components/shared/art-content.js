import { Avatar, Heading, HStack, Stack, Text } from '@chakra-ui/react'
import React from 'react'

import { Navigate } from '~components'

export const ArtContent = ({ art }) => {
  return (
    <Stack p={4} spacing={4} borderRadius='sm' bg='white' boxShadow='base'>
      <Heading as='h2' fontSize='3xl'>
        {art.title}
      </Heading>
      <Navigate href={`/club/artist/${art.artist.user.username}`}>
        <HStack>
          <Avatar
            size='sm'
            src={`${process.env.NEXT_PUBLIC_API_URL}${art.artist.user?.avatar?.url}`}
            name={art.artist.name || art.artist.user?.username}
          />
          <Text fontWeight='semibold' lineHeight={6} fontSize='md'>
            {art.artist.name || art.artist.user?.username}
          </Text>
        </HStack>
      </Navigate>

      {/* TODO Does it supposed to be markdown?  */}
      <Text fontSize='md' lineHeight={6}>
        {art.content}
      </Text>
    </Stack>
  )
}

export default ArtContent
