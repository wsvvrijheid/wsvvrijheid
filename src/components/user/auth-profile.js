import {
  Avatar,
  Box,
  Button,
  HStack,
  SimpleGrid,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useDisclosure,
} from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import React from 'react'
import { FaPaintBrush, FaSpinner, FaUpload } from 'react-icons/fa'
import { IoMdSettings } from 'react-icons/io'
import { MdRemoveModerator } from 'react-icons/md'
import { useQuery } from 'react-query'

import { ArtCard, Container, CreateArtForm, Hero } from '~components'
import { request } from '~lib'

export const AuthenticatedUserProfile = ({ user }) => {
  const { locale } = useRouter()
  const { t } = useTranslation()
  const { isOpen, onOpen, onClose } = useDisclosure()

  const { data } = useQuery({
    queryKey: ['arts', user.username],
    queryFn: () =>
      request({
        // TODO Fetch draft arts to allow user to publish them
        publicationState: 'preview',
        url: 'api/arts',
        locale,
        filters: {
          artist: { id: { $eq: user.artist?.id } },
        },
        populate: ['artist.user', 'images'],
      }),
  })

  const rejected = data?.result?.filter(art => art.status === 'rejected')
  const approved = data?.result?.filter(art => art.status === 'approved')
  const pending = data?.result?.filter(art => art.status === 'pending')

  return (
    <>
      <CreateArtForm isOpen={isOpen} onClose={onClose} user={user} />
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
        <Tabs isLazy my={4} overflowX='auto'>
          <TabList overflowX='auto' minW='max-content' w='full'>
            {user.artist && (
              <>
                <Tab fontWeight='semibold'>
                  <Box as={FaPaintBrush} mr={1} /> {t`profile.approved-arts`}
                </Tab>
                <Tab fontWeight='semibold'>
                  <Box as={FaSpinner} mr={1} /> {t`profile.pending-arts`}
                </Tab>
                <Tab fontWeight='semibold'>
                  <Box as={MdRemoveModerator} mr={1} /> {t`profile.rejected-arts`}
                </Tab>
              </>
            )}
            <Tab ml='auto' fontWeight='semibold'>
              <Box as={IoMdSettings} mr={1} /> {t`profile.general-settings`}
            </Tab>
            {user.artist && (
              <Button colorScheme='blue' leftIcon={<FaUpload />} onClick={onOpen}>
                {t`profile.upload-art`}
              </Button>
            )}
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
            {/* Pending arts */}
            <TabPanel px={0}>
              <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} gap={4}>
                {pending?.map(art => {
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
