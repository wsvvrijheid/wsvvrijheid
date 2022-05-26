import { Avatar, Box, HStack, SimpleGrid, Stack, Tab, TabList, TabPanel, TabPanels, Tabs, Text } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import React from 'react'
import { FaPaintBrush } from 'react-icons/fa'
import { IoMdSettings } from 'react-icons/io'
import { MdRemoveModerator } from 'react-icons/md'
import { useQuery } from 'react-query'

import { ArtCard, Container, CreateArt, Hero } from '~components'
import { request } from '~lib'

export const AuthenticatedUserProfile = ({ user }) => {
  const { locale } = useRouter()
  const { t } = useTranslation()

  const { data } = useQuery({
    queryKey: ['arts', user.username],
    queryFn: () =>
      request({
        // TODO Fetch draft arts to allow user to publish them
        publicationState: 'preview',
        url: 'api/arts',
        locale,
        filters: {
          artist: { user: { id: { $eq: user.id } } },
        },
        populate: ['artist.user', 'images'],
      }),
  })

  const rejected = data?.result?.filter(art => art.status === 'rejected')
  const approved = data?.result?.filter(art => art.status !== 'rejected')

  return (
    <>
      <Hero image='/images/auth-profile-bg.avif'>
        <Stack>
          <Avatar
            size='lg'
            src={`${process.env.NEXT_PUBLIC_API_URL}${user.avatar?.formats.thumbnail.url || user.avatar?.url}`}
            name={user.username}
          />
          <HStack justifyContent='center' alignItems={'center'} alignContent={'flex-end'} bg='transparent'>
            <Text color={'white'}>{user.username}</Text>
          </HStack>
        </Stack>
      </Hero>
      <Container>
        <Tabs isLazy my={4}>
          <TabList>
            <Tab fontWeight='semibold'>
              <Box as={FaPaintBrush} mr={1} /> {t`profile.my-arts`}
            </Tab>
            <Tab fontWeight='semibold'>
              <Box as={MdRemoveModerator} mr={1} /> {t`profile.my-rejected-arts`}
            </Tab>
            <Tab fontWeight='semibold'>
              <Box as={IoMdSettings} mr={1} /> {t`profile.general-settings`}
            </Tab>
          </TabList>
          <TabPanels>
            {/* Approved arts */}
            <TabPanel px={0}>
              <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} gap={4}>
                {approved?.map(art => {
                  return <ArtCard art={art} user={user} key={art.id} />
                })}
              </SimpleGrid>
            </TabPanel>
            {/* rejected arts */}
            <TabPanel>
              <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} gap={4}>
                {rejected?.map(art => {
                  return <ArtCard art={art} user={user} key={art.id} />
                })}
              </SimpleGrid>
            </TabPanel>
            {/* general Settings */}
            <TabPanel>
              <Settings user={user} />
            </TabPanel>
          </TabPanels>
        </Tabs>
        <CreateArt />
      </Container>
    </>
  )
}

export const Settings = props => {
  const { user } = props
  return (
    <Stack>
      <Text>Username: {user.username}</Text>
      <Text>Email: {user.email}</Text>
    </Stack>
  )
}
