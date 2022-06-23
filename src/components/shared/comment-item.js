import { Avatar, HStack, Stack, Text } from '@chakra-ui/react'
import { formatDistanceStrict } from 'date-fns'

export const CommentItem = ({ comment }) => {
  const name = comment.user?.name || comment.user?.artist?.name || comment.user?.username || comment.name

  return (
    <HStack align='start'>
      <Avatar size='sm' src={`${process.env.NEXT_PUBLIC_API_URL}${comment.user?.avatar.url}`} name={name} />
      <Stack fontSize='sm'>
        <HStack>
          <Text fontWeight={600}>{name}</Text>
          <Text textColor='gray.500' fontSize='xs'>
            {formatDistanceStrict(new Date(comment.createdAt), new Date())}
          </Text>
        </HStack>

        {/* TODO Add read more button like instagram */}
        <Text noOfLines={3}>{comment.content}</Text>
      </Stack>
    </HStack>
  )
}
