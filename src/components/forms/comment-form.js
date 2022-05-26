import { Avatar, Button, HStack, IconButton, Input, Stack, Text, Textarea, VStack } from '@chakra-ui/react'
import { useTranslation } from 'next-i18next'
import React from 'react'
import { FiArrowRight } from 'react-icons/fi'

export const CommentForm = ({ user }) => {
  const { t } = useTranslation()

  // TODO Show login alert if user is not logged in

  return (
    <Stack spacing={4} p={4} boxShadow='base' borderRadius='sm' bg='white'>
      <Text textAlign='left' fontSize='16px' fontWeight='semibold' textTransform='capitalize'>
        {t('apply-form.comment-placeholder')}
      </Text>
      <VStack alignItems='flex-start' justify='flex-start'>
        <HStack w='100%' alignItems='flex-start'>
          <Avatar size='sm' src={`${user?.avatar?.url}`} name={`${user?.username}`} />
          <Textarea
            display={{
              base: 'none',
              sm: 'flex',
            }}
            size='md'
            placeholder={t('apply-form.comment-placeholder')}
          />
          <Input
            display={{
              base: 'flex',
              sm: 'none',
            }}
            variant='outline'
            placeholder={t('apply-form.comment-placeholder')}
          />
          <IconButton
            display={{
              base: 'flex',
              sm: 'none',
            }}
            colorScheme='blue'
            aria-label='Send Comment '
            fontSize='20px'
            icon={<FiArrowRight />}
            isRound
          />
        </HStack>
        <Button
          display={{
            base: 'none',
            sm: 'flex',
          }}
          alignSelf='flex-end'
          size='md'
          colorScheme='blue'
          rightIcon={<FiArrowRight />}
        >
          {t('apply-form.send')}
        </Button>
      </VStack>
    </Stack>
  )
}
