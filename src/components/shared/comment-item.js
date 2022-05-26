import { Avatar, HStack, Stack, Text } from '@chakra-ui/react'
import { formatDistanceStrict } from 'date-fns'

export const CommentItem = ({ comment }) => {
  return (
    <HStack align='start'>
      <Avatar size='sm' src={`${comment.user.avatar.url}`} name={`${comment.user.username}`} />
      <Stack fontSize='sm'>
        <HStack>
          <Text fontWeight='semibold'>{comment.user.username}</Text>
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
