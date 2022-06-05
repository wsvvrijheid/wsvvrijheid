import { Avatar, Button, Heading, HStack, Spacer, Stack, Text } from '@chakra-ui/react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import React from 'react'
import { FaChevronRight } from 'react-icons/fa'

export const ProjectsList = ({ projects }) => {
  const { t } = useTranslation()
  const { locale } = useRouter()

  return (
    <Stack spacing={8}>
      {projects.map(p => (
        <HStack align='start' key={p.code} p={8} spacing={4} bg='white' rounded='lg' shadow='md'>
          {/* TODO Create image component to handle internal/external image paths */}
          <Avatar size='2xl' src={process.env.NEXT_PUBLIC_API_URL + p.image.url} />
          <Stack align='start'>
            <Heading textAlign='center' size='md' as='h3' fontWeight='black'>
              {p[`name_${locale}`]}
            </Heading>
            <Text fontSize='sm'>{p[`description_${locale}`]}</Text>
            <Spacer />
            <Link href={''} passHref>
              <Button rightIcon={<FaChevronRight />} variant='link' rel='noopener noreferrer' colorScheme='blue'>
                {t`read-more`}
              </Button>
            </Link>
          </Stack>
        </HStack>
      ))}
    </Stack>
  )
}
