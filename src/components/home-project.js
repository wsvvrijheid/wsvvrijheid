import { Button, Center, Heading, Image, SimpleGrid, Stack, Text } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import React from 'react'

import { AnimatedBox, Container, Navigate } from '~components'

export const HomeProject = ({ project, index }) => {
  const { locale } = useRouter()
  const { t } = useTranslation()
  return (
    <Center py={{ base: 16, lg: 32 }} minH={{ base: '100vh', lg: '50vh' }} bg={project.colors.bg}>
      <Container>
        <SimpleGrid columns={{ base: 1, lg: 2 }} justifyItems='center' gap={8}>
          <AnimatedBox directing={index % 2 ? 'to-left' : 'to-right'}>
            <Image
              order={{ base: 1, lg: index % 2 ? 2 : 1 }}
              src={project.image}
              boxSize={200}
              alt={project.title[locale]}
            />
          </AnimatedBox>
          <AnimatedBox directing={index % 2 ? 'to-right' : 'to-left'}>
            <Stack spacing={4} order={{ base: 2, lg: index % 2 ? 1 : 2 }} textAlign={{ base: 'center', lg: 'left' }}>
              <Heading size='lg' fontWeight='black' color={project.colors.header}>
                {project.title[locale]}
              </Heading>
              <Text color={project.colors.text}>{project.description[locale]}</Text>
              <Navigate
                size='lg'
                alignSelf={{ base: 'center', lg: 'start' }}
                color={project.colors.header}
                variant='link'
                as={Button}
                href={project.link}
              >
                {t`read-more`}
              </Navigate>
            </Stack>
          </AnimatedBox>
        </SimpleGrid>
      </Container>
    </Center>
  )
}
