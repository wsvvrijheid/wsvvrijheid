import { Avatar, Text, VStack } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import React from 'react'

export const HomeAbout = ({ item }) => {
  const { locale } = useRouter()

  return (
    <VStack align='stretch' spacing={4}>
      <Avatar alignSelf='center' size='2xl' src={item.image} />
      <Text fontSize='xl' fontWeight={600}>
        {item.title[locale]}
      </Text>
      <Text>{item.description[locale]}</Text>
    </VStack>
  )
}
