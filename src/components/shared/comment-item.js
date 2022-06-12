import { Avatar, HStack, Stack, Text } from '@chakra-ui/react'
import { formatDistanceStrict } from 'date-fns'

export const CommentItem = ({ comment }) => {
  // TODO Check comment authors. Author field should not be empty
  if (!comment.author) return null

  return (
    <HStack align='start'>
      <Avatar size='sm' src={`${comment.author.avatar}`} name={`${comment.author.name}`} />
      <Stack fontSize='sm'>
        <HStack>
          <Text fontWeight='semibold'>{comment.author.name}</Text>
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
