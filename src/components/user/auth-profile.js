import { Avatar, Box, HStack, SimpleGrid, Stack, Tab, TabList, TabPanel, TabPanels, Tabs, Text } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import { FaPaintBrush, FaSpinner } from 'react-icons/fa'
import { IoMdSettings } from 'react-icons/io'
import { MdRemoveModerator } from 'react-icons/md'
import { useQuery } from 'react-query'

import { ArtCard, Container, CreateArtForm, Hero } from '~components'
import { request } from '~lib'

export const AuthenticatedUserProfile = ({ auth }) => {
  const { locale } = useRouter()
  const { t } = useTranslation()

  const { user } = auth

  const { data } = useQuery({
    queryKey: ['arts', user.username],
    queryFn: () =>
      request({
        // TODO Fetch draft arts to allow user to publish them
        publicationState: 'preview',
        url: 'api/arts',
        locale,
        filters: {
          artist: { id: { $eq: user.artist?.id || null } },
        },
        populate: ['artist.user', 'images'],
      }),
  })

  const rejected = data?.result?.filter(art => art.status === 'rejected')
  const approved = data?.result?.filter(art => art.status === 'approved')
  const pending = data?.result?.filter(art => art.status === 'pending')

  return (
    <>
      <Hero>
        <Stack>
          <Avatar
            size='lg'
            src={`${process.env.NEXT_PUBLIC_API_URL}${user.avatar?.formats.thumbnail.url || user.avatar?.url}`}
            name={user.username}
          />
          <HStack justifyContent='center' alignItems={'center'} alignContent={'flex-end'} bg='transparent'>
            <Text color={'white'}>{user.name || user.username}</Text>
          </HStack>
        </Stack>
      </Hero>
      <Container>
        <Tabs isLazy my={4}>
          <Box overflowX='auto'>
            <TabList overflowX='auto' minW='max-content' w='full'>
              {user.artist && (
                <>
                  <Tab fontWeight={600}>
                    <Box as={FaPaintBrush} mr={1} /> {t`profile.approved-arts`}
                  </Tab>
                  <Tab fontWeight={600}>
                    <Box as={FaSpinner} mr={1} /> {t`profile.pending-arts`}
                  </Tab>
                  <Tab fontWeight={600}>
                    <Box as={MdRemoveModerator} mr={1} /> {t`profile.rejected-arts`}
                  </Tab>
                </>
              )}
              <Tab ml='auto' fontWeight={600}>
                <Box as={IoMdSettings} mr={1} /> {t`profile.general-settings`}
              </Tab>
              <Box my={1} ml={2}>
                <CreateArtForm auth={auth} />
              </Box>
            </TabList>
          </Box>
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
