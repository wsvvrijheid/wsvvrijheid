import { Avatar, Button, Heading, Spacer, Stack, Text } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import React from 'react'
import { FaChevronRight } from 'react-icons/fa'

import { Navigate } from './shared/navigate'

export const ProjectsList = ({ projects }) => {
  const { t } = useTranslation()
  const { locale } = useRouter()

  return (
    <Stack spacing={8}>
      {projects.map(p => (
        <Stack
          direction={{ base: 'column', lg: 'row' }}
          align={{ base: 'center', lg: 'start' }}
          key={p.code}
          p={8}
          spacing={4}
          bg='white'
          rounded='lg'
          shadow='md'
        >
          {/* TODO Create image component to handle internal/external image paths */}
          <Avatar size='2xl' src={process.env.NEXT_PUBLIC_API_URL + p.image.url} />
          <Stack align={{ base: 'center', lg: 'start' }}>
            <Heading textAlign='center' size='md' as='h3' fontWeight='black'>
              {p[`name_${locale}`]}
            </Heading>
            <Text fontSize='sm'>{p[`description_${locale}`]}</Text>
            <Spacer />

            <Navigate href={`/${locale}/platforms/${p.code}`}>
              <Button rightIcon={<FaChevronRight />} variant='link' colorScheme='blue'>
                {t`read-more`}
              </Button>
            </Navigate>
          </Stack>
        </Stack>
      ))}
    </Stack>
  )
}
