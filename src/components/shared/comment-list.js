import { FormControl, HStack, Select, Stack, Text } from '@chakra-ui/react'
import { useTranslation } from 'next-i18next'

import { CommentItem } from '~components'

export const CommentList = ({ comments }) => {
  const { t } = useTranslation()
  // TODO List comments including threads of each comment
  console.log('comments', comments)

  const commentsList = [
    {
      id: '1',
      content: 'This is a comment',
      createdAt: '2022-03-22T11:33:06.622Z',
      user: {
        id: '1',
        username: 'username',
        avatar: {
          url: 'https://via.placeholder.com/150',
        },
      },
    },
    {
      id: '2',
      content: `Bu projeyle evrensel insan haklarının medya ve iletişim yoluyla anlatılabilmesi için; oyunculuk,
              yönetmenlik, senaristlik gibi alanlarda tecrübe kazanma, tecrübeleri geliştirme ve sayılan alanlarda
              stajla birlikte referans sağlama amaçlanmaktadır. Kısa film, tiyatro gibi projelerin geliştirilmesi
              düşünülmektedir.`,
      createdAt: '2022-05-12T11:33:06.622Z',
      user: {
        id: '2',
        username: 'username2',
        avatar: {
          url: 'https://via.placeholder.com/150',
        },
      },
    },
    {
      id: '3',
      content: `Bu projeyle evrensel insan haklarının medya ve iletişim yoluyla anlatılabilmesi için; oyunculuk,
              yönetmenlik, senaristlik gibi alanlarda tecrübe kazanma, tecrübeleri geliştirme ve sayılan alanlarda
              stajla birlikte referans sağlama amaçlanmaktadır. Kısa film, tiyatro gibi projelerin geliştirilmesi
              düşünülmektedir.`,
      createdAt: '2022-05-12T11:33:06.622Z',
      user: {
        id: '2',
        username: 'username2',
        avatar: {
          url: 'https://via.placeholder.com/150',
        },
      },
    },
  ]

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
        {commentsList.map(comment => {
          return <CommentItem key={comment.id} comment={comment} />
        })}
      </Stack>
    </Stack>
  )
}
