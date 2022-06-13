import { Avatar, Box, ButtonGroup, IconButton, Link, Stack, Text } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { FaEnvelope, FaFacebook, FaInstagram, FaLinkedin, FaTwitter } from 'react-icons/fa'

const icons = {
  email: <FaEnvelope />,
  facebook: <FaFacebook />,
  instagram: <FaInstagram />,
  linkedin: <FaLinkedin />,
  twitter: <FaTwitter />,
}

export const UserCard = ({ user }) => {
  const { locale } = useRouter()

  const socialIcons = {
    twitter: user.twitter,
    facebook: user.facebook,
    instagram: user.instagram,
    linkedin: user.linkedin,
    email: user.email,
  }

  return (
    <Stack p={6} spacing={4} rounded='md' bg='white' w='full' shadow='md' align='center'>
      {/* TODO Create shared image component */}
      <Avatar name={user.username} size='lg' src={process.env.NEXT_PUBLIC_API_URL + user.avatar?.url} />
      <Text textAlign='center' fontSize='lg' fontWeight='semibold' color='blue.500'>
        {user.username}
      </Text>
      <ButtonGroup size='sm'>
        {Object.entries(socialIcons)
          .filter(([, url]) => url)
          .map(([name, url], i) => (
            <Link key={i} href={name === 'email' ? `mailto:${url}` : url}>
              <IconButton variant='outline' isRound icon={icons[name]} />
            </Link>
          ))}
      </ButtonGroup>

      <Box textAlign='center' fontSize='sm'>
        {user.jobs.map(job => job[`name_${locale}`]).join(' ✽ ')}
      </Box>
    </Stack>
  )
}
