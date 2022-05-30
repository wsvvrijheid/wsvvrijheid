import { FormControl, HStack, Select, Stack, Text } from '@chakra-ui/react'
import { useTranslation } from 'next-i18next'

import { CommentItem } from '~components'

export const CommentList = ({ comments }) => {
  const { t } = useTranslation()

  return (
    <Stack p={4} spacing={4} bg='white' boxShadow='base'>
      <HStack justifyContent={'space-between'}>
        <Text fontSize='lg' fontWeight='semibold'>
          {t('apply-form.comments')}
        </Text>

        <FormControl w='auto'>
          <Select id='category'>
            <option>Popular</option>
            <option>Latest</option>
          </Select>
        </FormControl>
      </HStack>
      <Stack spacing={4}>
        {comments?.map(comment => {
          return <CommentItem key={comment.id} comment={comment} />
        })}
      </Stack>
    </Stack>
  )
}
