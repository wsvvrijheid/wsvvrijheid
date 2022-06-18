import { Avatar, Center, Heading, Image, Stack, Text } from '@chakra-ui/react'

import { Navigate } from '~components'

export const Card = ({ title, description, image, link, rounded }) => {
  return (
    <Navigate href={link}>
      <Stack h='full' bg='white' shadow='lg' rounded='lg' overflow='hidden' role='group'>
        <Center overflow='hidden'>
          {/* TODO Create shared image component */}
          {rounded ? (
            <Avatar
              objectFit='cover'
              boxSize={48}
              src={process.env.NEXT_PUBLIC_API_URL + image}
              alt='project image'
              transition='transform 0.5s ease-in-out'
              _groupHover={{ transform: 'scale(1.1)' }}
            />
          ) : (
            <Image
              objectFit='cover'
              h={48}
              w='full'
              src={process.env.NEXT_PUBLIC_API_URL + image}
              alt='project image'
              transition='transform 0.5s ease-in-out'
              _groupHover={{ transform: 'scale(1.1)' }}
            />
          )}
        </Center>

        <Stack spacing={4} flex={1} p={{ base: 4, lg: 8 }} align='center' textAlign='center'>
          <Heading
            as='h3'
            fontWeight='black'
            textTransform='uppercase'
            fontSize='xl'
            letterSpacing='wide'
            color='blue.500'
          >
            {title}
          </Heading>
          <Text fontSize='md' lineHeight='base' noOfLines={3}>
            {description}
          </Text>
        </Stack>
      </Stack>
    </Navigate>
  )
}
