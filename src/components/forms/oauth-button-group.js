import { Box, Button, ButtonGroup, Link, VisuallyHidden } from '@chakra-ui/react'
import { FaFacebook, FaGoogle, FaTwitter } from 'react-icons/fa'

const providers = [
  {
    name: 'Google',
    icon: <Box as={FaGoogle} color='red.500' boxSize='5' />,
    url: '/api/connect/google',
  },
  {
    name: 'Twitter',
    icon: <Box as={FaTwitter} color='twitter.500' boxSize='5' />,
    url: '/api/connect/twitter',
  },
  {
    name: 'Facebook',
    icon: <Box as={FaFacebook} color='facebook.500' boxSize='5' />,
    url: '/api/connect/facebook',
  },
]

const backendUrl = process.env.NEXT_PUBLIC_API_URL

export const OAuthButtonGroup = () => {
  const onSocialLogin = async url => {
    window.open(`${backendUrl}${url}`, '_self')
  }
  return (
    <ButtonGroup variant='outline' spacing='4' width='full'>
      {providers.map(({ name, icon, url }) => (
        <Button
          as={Link}
          key={name}
          isFullWidth
          onClick={() => {
            onSocialLogin(url)
          }}
        >
          <VisuallyHidden>Sign in with {name}</VisuallyHidden>
          {icon}
        </Button>
      ))}
    </ButtonGroup>
  )
}
